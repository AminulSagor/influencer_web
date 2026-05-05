"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TrashIcon } from "lucide-react";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import SubmissionProofs from "./submission-proof";
import { milestoneSubmissionService } from "@/service/agency/campaign/milestone-submission.service";
import type {
  AgencyMilestoneDetails,
  AgencyMilestoneSubmissionItem,
  MilestoneTargetTitle,
  SubmitAgencyMilestonePayload,
  UpdateAgencySubmissionResultsPayload,
} from "@/types/agency/campaign/milestone-submission.types";

const formSchema = z.object({
  submissions: z.array(
    z.object({
      description: z.string().optional(),
      paymentAmount: z.string().min(1, "Payment amount required"),
      liveLinks: z
        .array(
          z.object({
            url: z.string().trim().min(1, "Live link is required"),
          })
        )
        .min(1, "At least one live link is required"),
      performanceMetric: z.string().min(1, "Performance metric is required"),
      attachments: z
        .array(
          z.object({
            attachment: z.string().trim().min(1, "Proof attachment is required"),
          })
        )
        .min(1, "At least one proof is required"),
      ownershipConfirmed: z.boolean().refine((value) => value === true, {
        message: "You must confirm ownership",
      }),
      termsAccepted: z.boolean().refine((value) => value === true, {
        message: "You must accept terms",
      }),
    })
  ),
});

export type FormType = z.infer<typeof formSchema>;

interface SubmissionFormProps {
  milestoneId: string;
  initialSubmissionCount?: number;
  maxRequestAmount?: number;
  onSubmitted?: (submission: AgencyMilestoneSubmissionItem) => void;
  initialSubmissions?: AgencyMilestoneSubmissionItem[];
  canAddNewSubmission?: boolean;
}

type StatusByIndex = Record<number, string>;

type SubmitOptions = {
  silent?: boolean;
  skipNotify?: boolean;
};

const RESUBMIT_STATUSES = ["in_review", "in-review", "declined", "decline", "rejected"];

const createBlankSubmission = (): FormType["submissions"][number] => ({
  description: "",
  paymentAmount: "",
  liveLinks: [{ url: "" }],
  performanceMetric: "",
  attachments: [{ attachment: "" }],
  ownershipConfirmed: false,
  termsAccepted: false,
});

function normalizeStatus(status?: string | null) {
  return String(status ?? "").trim().toLowerCase();
}

function canResubmitSubmission(submission?: AgencyMilestoneSubmissionItem | null) {
  return RESUBMIT_STATUSES.includes(normalizeStatus(submission?.status));
}

function formatSubmissionStatus(status?: string | null) {
  if (!status) return "In Review";

  return String(status)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusBadgeClassName(status?: string | null) {
  const normalized = normalizeStatus(status);

  if (["declined", "decline", "rejected"].includes(normalized)) {
    return "bg-[#FF1616] text-white";
  }

  if (["approved", "completed", "paid"].includes(normalized)) {
    return "bg-light-green text-white";
  }

  return "bg-orange/30 text-orange";
}

function parseAmount(value: string): number {
  return Number(value.replace(/[^\d.]/g, "").trim());
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(Math.max(value, 0));
}

function parseMetricValue(value: string): number | null {
  const normalized = value.trim().replace(/,/g, "").toUpperCase();

  if (!normalized) return null;

  if (normalized.endsWith("K")) {
    const base = Number(normalized.replace("K", ""));
    return Number.isFinite(base) ? Math.round(base * 1000) : null;
  }

  if (normalized.endsWith("M")) {
    const base = Number(normalized.replace("M", ""));
    return Number.isFinite(base) ? Math.round(base * 1000000) : null;
  }

  const numberValue = Number(normalized.replace(/[^\d.]/g, ""));
  return Number.isFinite(numberValue) ? Math.round(numberValue) : null;
}

function metricToInputValue(value?: number | string | null): string {
  if (value === null || value === undefined || value === "") return "";

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "";

  const formatCompact = (amount: number, suffix: "K" | "M") => {
    const formatted = Number(amount.toFixed(1)).toString();
    return `${formatted}${suffix}`;
  };

  if (Math.abs(numericValue) >= 1_000_000) {
    return formatCompact(numericValue / 1_000_000, "M");
  }

  if (Math.abs(numericValue) >= 1_000) {
    return formatCompact(numericValue / 1_000, "K");
  }

  return String(numericValue);
}

function getPositiveMetricValue(value: number | null | undefined) {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
}

function getSubmissionMetricValue(
  submission?: AgencyMilestoneSubmissionItem | null,
  targetTitle?: MilestoneTargetTitle | null
) {
  if (!submission) return null;

  if (submission.targetAmount != null) {
    return Number(submission.targetAmount);
  }

  const resolvedTargetTitle = submission.targetTitle ?? targetTitle;

  if (resolvedTargetTitle === "Reach") return submission.achievedReach;
  if (resolvedTargetTitle === "Views") return submission.achievedViews;
  if (resolvedTargetTitle === "Likes") return submission.achievedLikes;
  if (resolvedTargetTitle === "Comments") return submission.achievedComments;
  if (resolvedTargetTitle === "Follows") return submission.achievedFollows;

  return (
    submission.achievedReach ??
    submission.achievedViews ??
    submission.achievedLikes ??
    submission.achievedComments ??
    submission.achievedFollows ??
    null
  );
}

function createSubmissionFromExisting(
  submission: AgencyMilestoneSubmissionItem,
  targetTitle?: MilestoneTargetTitle | null
): FormType["submissions"][number] {
  return {
    description: submission.submissionDescription ?? "",
    paymentAmount: submission.requestedAmount ? String(Number(submission.requestedAmount)) : "",
    liveLinks: submission.submissionLiveLinks?.length
      ? submission.submissionLiveLinks.map((url) => ({ url }))
      : [{ url: "" }],
    performanceMetric: metricToInputValue(getSubmissionMetricValue(submission, targetTitle)),
    attachments: submission.submissionAttachments?.length
      ? submission.submissionAttachments.map((attachment) => ({ attachment }))
      : [{ attachment: "" }],
    ownershipConfirmed: true,
    termsAccepted: true,
  };
}

function createDefaultValues(
  initialSubmissions: AgencyMilestoneSubmissionItem[] = [],
  targetTitle?: MilestoneTargetTitle | null
): FormType {
  return {
    submissions: initialSubmissions.length
      ? initialSubmissions.map((submission) =>
          createSubmissionFromExisting(submission, targetTitle)
        )
      : [createBlankSubmission()],
  };
}

function resolveMilestoneTarget(
  milestone: AgencyMilestoneDetails | null
): { targetTitle: MilestoneTargetTitle; expectedTargetAmount: number } | null {
  if (!milestone) return null;

  const reach = getPositiveMetricValue(milestone.expectedReach);
  if (reach !== null) {
    return { targetTitle: "Reach", expectedTargetAmount: reach };
  }

  const views = getPositiveMetricValue(milestone.expectedViews);
  if (views !== null) {
    return { targetTitle: "Views", expectedTargetAmount: views };
  }

  const likes = getPositiveMetricValue(milestone.expectedLikes);
  if (likes !== null) {
    return { targetTitle: "Likes", expectedTargetAmount: likes };
  }

  const comments = getPositiveMetricValue(milestone.expectedComments);
  if (comments !== null) {
    return { targetTitle: "Comments", expectedTargetAmount: comments };
  }

  const follows = getPositiveMetricValue(milestone.expectedFollows);
  if (follows !== null) {
    return { targetTitle: "Follows", expectedTargetAmount: follows };
  }

  return null;
}

function isAgencyMilestoneDetails(
  value: unknown
): value is AgencyMilestoneDetails {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.contentTitle === "string" &&
    typeof candidate.platform === "string"
  );
}

function getLegacyMetricFields(targetTitle: MilestoneTargetTitle, metricValue: number) {
  return {
    achievedReach: targetTitle === "Reach" ? metricValue : null,
    achievedViews: targetTitle === "Views" ? metricValue : null,
    achievedLikes: targetTitle === "Likes" ? metricValue : null,
    achievedComments: targetTitle === "Comments" ? metricValue : null,
    achievedFollows: targetTitle === "Follows" ? metricValue : null,
  };
}

function buildSubmissionResultsPayload(
  targetTitle: MilestoneTargetTitle,
  metricValue: number
): UpdateAgencySubmissionResultsPayload {
  if (targetTitle === "Reach") return { achievedReach: metricValue };
  if (targetTitle === "Views") return { achievedViews: metricValue };
  if (targetTitle === "Likes") return { achievedLikes: metricValue };
  if (targetTitle === "Comments") return { achievedComments: metricValue };
  if (targetTitle === "Follows") return { achievedFollows: metricValue };

  return {};
}

function buildOptimisticSubmission(
  milestoneId: string,
  payload: SubmitAgencyMilestonePayload,
  targetTitle: MilestoneTargetTitle,
  existingSubmission?: AgencyMilestoneSubmissionItem | null
): AgencyMilestoneSubmissionItem {
  const metricValue = Number(payload.targetAmount ?? 0);

  return {
    id: existingSubmission?.id ?? `temp-${Date.now()}`,
    submissionDescription: payload.description || null,
    submissionAttachments: payload.proofAttachments,
    submissionLiveLinks: payload.liveLinks,
    requestedAmount: String(payload.requestPaymentAmount),
    submittedByRole: "agency",
    rejectionReason: existingSubmission?.rejectionReason ?? null,
    isClientApproved: false,
    ...getLegacyMetricFields(targetTitle, metricValue),
    targetTitle,
    targetAmount: metricValue,
    paidAmount: existingSubmission?.paidAmount ?? "0.00",
    paymentStatus: existingSubmission?.paymentStatus ?? "unpaid",
    adminFeedback: existingSubmission?.adminFeedback ?? null,
    status: "in_review",
    assignmentId: existingSubmission?.assignmentId ?? null,
    milestoneId,
    assignedMilestoneId: existingSubmission?.assignedMilestoneId ?? null,
    createdAt: existingSubmission?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const SubmissionForm = ({
  milestoneId,
  initialSubmissionCount = 0,
  maxRequestAmount,
  onSubmitted,
  initialSubmissions = [],
  canAddNewSubmission = true,
}: SubmissionFormProps) => {
  const [statusByIndex, setStatusByIndex] = useState<StatusByIndex>({});
  const [submittingIndex, setSubmittingIndex] = useState<number | null>(null);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [milestoneDetails, setMilestoneDetails] =
    useState<AgencyMilestoneDetails | null>(null);
  const [isMilestoneLoading, setIsMilestoneLoading] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(initialSubmissions),
  });

  const { fields: submissionFields, append, remove } = useFieldArray({
    control: form.control,
    name: "submissions",
  });

  useEffect(() => {
    const fetchMilestoneDetails = async () => {
      if (!milestoneId) return;

      try {
        setIsMilestoneLoading(true);

        const response =
          await milestoneSubmissionService.getMilestoneDetails(milestoneId);

        if (isAgencyMilestoneDetails(response?.data)) {
          setMilestoneDetails(response.data);
        } else if (isAgencyMilestoneDetails(response)) {
          setMilestoneDetails(response);
        } else {
          setMilestoneDetails(null);
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ??
          error?.message ??
          "Failed to load milestone details.";

        toast.error(
          Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
        );
      } finally {
        setIsMilestoneLoading(false);
      }
    };

    void fetchMilestoneDetails();
  }, [milestoneId]);

  const targetConfig = useMemo(
    () => resolveMilestoneTarget(milestoneDetails),
    [milestoneDetails]
  );

  useEffect(() => {
    if (initialSubmissions.length > 0) {
      form.reset(createDefaultValues(initialSubmissions, targetConfig?.targetTitle));
    }
  }, [form, initialSubmissions, targetConfig?.targetTitle]);

  const handleSubmitSingle = async (
    index: number,
    options: SubmitOptions = {}
  ): Promise<AgencyMilestoneSubmissionItem | null> => {
    const isValid = await form.trigger(`submissions.${index}`);

    if (!isValid) return null;

    if (!targetConfig) {
      toast.error("Milestone target information is missing.");
      return null;
    }

    const submission = form.getValues(`submissions.${index}`);
    const existingSubmission = initialSubmissions[index];
    const shouldResubmit = canResubmitSubmission(existingSubmission);

    if (submission.ownershipConfirmed !== true) {
      form.setError(`submissions.${index}.ownershipConfirmed`, {
        type: "manual",
        message: "You must confirm ownership",
      });
      return null;
    }

    if (submission.termsAccepted !== true) {
      form.setError(`submissions.${index}.termsAccepted`, {
        type: "manual",
        message: "You must accept terms",
      });
      return null;
    }

    const requestPaymentAmount = parseAmount(submission.paymentAmount);
    const remainingAmount = maxRequestAmount ?? Number.POSITIVE_INFINITY;
    const existingRequestedAmount = shouldResubmit
      ? Number(existingSubmission?.requestedAmount ?? 0)
      : 0;
    const allowedRequestAmount = Number.isFinite(remainingAmount)
      ? remainingAmount + existingRequestedAmount
      : remainingAmount;

    if (!Number.isFinite(requestPaymentAmount) || requestPaymentAmount <= 0) {
      form.setError(`submissions.${index}.paymentAmount`, {
        type: "manual",
        message: "Enter a valid payment amount",
      });
      return null;
    }

    if (requestPaymentAmount > allowedRequestAmount) {
      form.setError(`submissions.${index}.paymentAmount`, {
        type: "manual",
        message: `You can request up to ৳${formatAmount(allowedRequestAmount)} remaining.`,
      });
      return null;
    }

    const liveLinks = submission.liveLinks
      .map((item) => item.url?.trim())
      .filter(Boolean);

    const proofAttachments = submission.attachments
      .map((item) => item.attachment?.trim())
      .filter(Boolean);

    const targetAmount = parseMetricValue(submission.performanceMetric);

    if (!targetAmount || targetAmount <= 0) {
      form.setError(`submissions.${index}.performanceMetric`, {
        type: "manual",
        message: "Enter a valid metric number",
      });
      return null;
    }

    const payload: SubmitAgencyMilestonePayload = {
      description: submission.description?.trim() || "",
      liveLinks,
      proofAttachments,
      requestPaymentAmount: Number(requestPaymentAmount.toFixed(2)),
      targetTitle: targetConfig.targetTitle,
      targetAmount,
    };

    try {
      setSubmittingIndex(index);

      const resubmitSubmissionId = existingSubmission?.id;

      if (shouldResubmit && !resubmitSubmissionId) {
        toast.error("Submission id is missing for resubmission.");
        return null;
      }

      const response = shouldResubmit
        ? await (async () => {
            const resubmitResponse = await milestoneSubmissionService.resubmitMilestone(
              resubmitSubmissionId as string,
              payload
            );

            await milestoneSubmissionService.updateSubmissionResults(
              resubmitSubmissionId as string,
              buildSubmissionResultsPayload(targetConfig.targetTitle, targetAmount)
            );

            return resubmitResponse;
          })()
        : await milestoneSubmissionService.submitMilestone(milestoneId, payload);

      const optimisticSubmission = buildOptimisticSubmission(
        milestoneId,
        payload,
        targetConfig.targetTitle,
        existingSubmission
      );

      setStatusByIndex((prev) => ({
        ...prev,
        [index]: "In Review",
      }));

      if (!options.skipNotify) {
        onSubmitted?.(optimisticSubmission);
      }

      if (!options.silent) {
        toast.success(
          typeof response.message === "string"
            ? response.message
            : shouldResubmit
              ? "Submission resubmitted successfully."
              : "Submission sent successfully."
        );
      }

      return optimisticSubmission;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ??
        error?.message ??
        (shouldResubmit
          ? "Failed to resubmit milestone."
          : "Failed to submit milestone.");

      toast.error(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
      return null;
    } finally {
      setSubmittingIndex(null);
    }
  };

  const handleSubmitAll = async () => {
    setIsSubmittingAll(true);

    try {
      const submissions = form.getValues("submissions");

      const submittedItems: AgencyMilestoneSubmissionItem[] = [];

      for (let index = 0; index < submissions.length; index += 1) {
        const submittedItem = await handleSubmitSingle(index, {
          silent: true,
          skipNotify: true,
        });

        if (!submittedItem) {
          toast.error(`Submission ${index + 1} could not be submitted.`);
          return;
        }

        submittedItems.push(submittedItem);
      }

      submittedItems.forEach((item) => onSubmitted?.(item));
      toast.success("All submissions sent successfully.");
    } finally {
      setIsSubmittingAll(false);
    }
  };

  return (
    <Form {...form}>
      <>
        <div className="space-y-2">
          {submissionFields.map((field, index) => {
            const ownershipId = `ownership-${index}`;
            const termsId = `terms-${index}`;
            const isSubmitting = submittingIndex === index;
            const existingSubmission = initialSubmissions[index];
            const isResubmission = canResubmitSubmission(existingSubmission);
            const isDeclined = ["declined", "decline", "rejected"].includes(
              normalizeStatus(existingSubmission?.status)
            );
            const showDeclinedReason =
              isDeclined && Boolean(existingSubmission?.rejectionReason?.trim());
            const submissionNumber = initialSubmissionCount + index + 1;
            const statusLabel =
              statusByIndex[index] ??
              (existingSubmission ? formatSubmissionStatus(existingSubmission.status) : "");
            const statusClassName = statusByIndex[index]
              ? "bg-orange/30 text-orange"
              : getStatusBadgeClassName(existingSubmission?.status);

            return (
              <div
                key={field.id}
                className={`rounded-xl border p-4 ${isDeclined ? "border-[#FF1616]" : ""}`}
              >
                <Accordion type="single" collapsible defaultValue={`submission-${index}`}>
                  <AccordionItem value={`submission-${index}`}>
                    <AccordionTrigger className="flex cursor-pointer justify-between hover:no-underline">
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-semibold text-Primary">
                          {isResubmission ? "Your Submission" : `Submission ${submissionNumber}`}
                        </p>
                        {statusLabel && (
                          <Badge className={statusClassName}>
                            {isDeclined && !statusByIndex[index]
                              ? "Declined"
                              : statusLabel}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="space-y-4 px-2">
                        <div
                          className={`grid grid-cols-1 gap-4 ${
                            showDeclinedReason ? "lg:grid-cols-2" : ""
                          }`}
                        >
                          <FormField
                            control={form.control}
                            name={`submissions.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between">
                                  <FormLabel className="flex items-center gap-2 text-lg">
                                    <FaUserEdit size={20} />
                                    Description / Update (Optional)
                                  </FormLabel>

                                  {submissionFields.length > 1 && !isResubmission && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        remove(index);
                                      }}
                                    >
                                      <TrashIcon className="h-4 w-4 cursor-pointer" />
                                    </Button>
                                  )}
                                </div>

                                <FormControl>
                                  <Textarea
                                    placeholder="Write Description"
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {showDeclinedReason ? (
                            <div className="space-y-2">
                              <p className="text-lg font-medium text-[#FF1616]">
                                Declined Reason
                              </p>

                              <div className="min-h-[112px] rounded-[10px] border border-[#FF1616] bg-white p-4 text-sm leading-relaxed text-black/80">
                                {existingSubmission?.rejectionReason?.trim() ||
                                  "Declined reason will be visible here"}
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <FormField
                          control={form.control}
                          name={`submissions.${index}.paymentAmount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-lg">
                                <RiMoneyDollarBoxLine size={20} />
                                Request Payment Amount
                              </FormLabel>

                              <FormControl>
                                <Input
                                  inputMode="decimal"
                                  placeholder={
                                    Number.isFinite(maxRequestAmount ?? NaN)
                                      ? `Remaining ৳${formatAmount(maxRequestAmount ?? 0)}`
                                      : "৳3,000"
                                  }
                                  {...field}
                                  onChange={(event) => {
                                    const sanitized = event.target.value.replace(/[^0-9.]/g, "");
                                    const numericValue = Number(sanitized);
                                    const existingRequestedAmount = isResubmission
                                      ? Number(existingSubmission?.requestedAmount ?? 0)
                                      : 0;
                                    const allowedRequestAmount = Number.isFinite(
                                      maxRequestAmount
                                    )
                                      ? (maxRequestAmount ?? 0) + existingRequestedAmount
                                      : maxRequestAmount;

                                    if (
                                      Number.isFinite(allowedRequestAmount) &&
                                      Number.isFinite(numericValue) &&
                                      numericValue > (allowedRequestAmount ?? 0)
                                    ) {
                                      field.onChange(String(allowedRequestAmount ?? 0));
                                      return;
                                    }

                                    field.onChange(sanitized);
                                  }}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <SubmissionProofs
                          control={form.control}
                          submissionIndex={index}
                          targetTitle={targetConfig?.targetTitle}
                        />

                        <FormField
                          control={form.control}
                          name={`submissions.${index}.ownershipConfirmed`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Checkbox
                                    id={ownershipId}
                                    checked={field.value === true}
                                    onCheckedChange={(checked) =>
                                      field.onChange(checked === true)
                                    }
                                  />
                                </FormControl>
                                <Label htmlFor={ownershipId} className="text-gray-400">
                                  Confirm you own all the submitted assets &amp; links
                                </Label>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`submissions.${index}.termsAccepted`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Checkbox
                                    id={termsId}
                                    checked={field.value === true}
                                    onCheckedChange={(checked) =>
                                      field.onChange(checked === true)
                                    }
                                  />
                                </FormControl>
                                <Label htmlFor={termsId} className="text-gray-400">
                                  You accept the{" "}
                                  <Link
                                    href="/"
                                    className="text-light-green hover:underline"
                                  >
                                    user license agreement
                                  </Link>{" "}
                                  &amp;{" "}
                                  <Link
                                    href="/"
                                    className="text-light-green hover:underline"
                                  >
                                    Terms and condition
                                  </Link>{" "}
                                  of our platform
                                </Label>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          onClick={() => void handleSubmitSingle(index)}
                          disabled={
                            isSubmitting ||
                            isSubmittingAll ||
                            isMilestoneLoading ||
                            form.watch(`submissions.${index}.ownershipConfirmed`) !== true ||
                            form.watch(`submissions.${index}.termsAccepted`) !== true
                          }
                          className="w-full bg-light-green hover:bg-light-green/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmitting
                            ? "Submitting..."
                            : isResubmission
                              ? "Resubmit for Admin Review"
                              : "Submit for Admin Review"}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          })}
        </div>

        {canAddNewSubmission && (
          <button
            type="button"
            onClick={() => append(createBlankSubmission())}
            className="mt-2 w-full cursor-pointer rounded-lg border border-dashed border-light-green py-6 font-semibold text-light-green transition-all duration-150 hover:bg-light-green hover:text-white"
          >
            + Add Another Submission
          </button>
        )}

        {submissionFields.length > 1 && (
          <Button
            type="button"
            onClick={() => void handleSubmitAll()}
            disabled={isSubmittingAll || submittingIndex !== null || isMilestoneLoading}
            className="mt-2 w-full bg-Primary hover:bg-Primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmittingAll ? "Submitting All..." : "Submit All Submissions"}
          </Button>
        )}
      </>
    </Form>
  );
};

export default SubmissionForm;
