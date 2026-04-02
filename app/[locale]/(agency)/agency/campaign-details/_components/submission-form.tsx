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
} from "@/types/agency/campaign/milestone-submission.types";

const formSchema = z.object({
  submissions: z.array(
    z.object({
      description: z.string().optional(),
      paymentAmount: z.string().min(1, "Payment amount required"),
      proofs: z
        .array(
          z.object({
            liveLink: z.string().url("Invalid link"),
            performanceMetric: z.string().min(1, "Performance metric is required"),
            attachment: z.any().optional(),
          })
        )
        .min(1, "At least one proof is required"),
    })
  ),
});

export type FormType = z.infer<typeof formSchema>;

interface SubmissionFormProps {
  milestoneId: string;
  onSubmitted?: (submission: AgencyMilestoneSubmissionItem) => void;
}

type StatusByIndex = Record<number, string>;

const defaultSubmission = {
  description: "",
  paymentAmount: "",
  proofs: [
    {
      attachment: "",
      liveLink: "",
      performanceMetric: "",
    },
  ],
};

function parseAmount(value: string): number {
  return Number(value.replace(/[^\d.]/g, "").trim());
}

function parseMetricValue(value: string): number | null {
  const normalized = value.trim().toUpperCase();

  if (!normalized) return null;

  if (normalized.endsWith("K")) {
    const base = Number(normalized.replace("K", ""));
    return Number.isFinite(base) ? base * 1000 : null;
  }

  if (normalized.endsWith("M")) {
    const base = Number(normalized.replace("M", ""));
    return Number.isFinite(base) ? base * 1000000 : null;
  }

  const numberValue = Number(normalized.replace(/[^\d.]/g, ""));
  return Number.isFinite(numberValue) ? numberValue : null;
}

function resolveMilestoneTarget(
  milestone: AgencyMilestoneDetails | null
): { targetTitle: MilestoneTargetTitle; targetAmount: number } | null {
  if (!milestone) return null;

  if (milestone.expectedReach != null) {
    return {
      targetTitle: "Reach",
      targetAmount: Number(milestone.expectedReach),
    };
  }

  if (milestone.expectedViews != null) {
    return {
      targetTitle: "Views",
      targetAmount: Number(milestone.expectedViews),
    };
  }

  if (milestone.expectedLikes != null) {
    return {
      targetTitle: "Likes",
      targetAmount: Number(milestone.expectedLikes),
    };
  }

  if (milestone.expectedComments != null) {
    return {
      targetTitle: "Comments",
      targetAmount: Number(milestone.expectedComments),
    };
  }

  if (milestone.expectedFollows != null) {
    return {
      targetTitle: "Follows",
      targetAmount: Number(milestone.expectedFollows),
    };
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

function buildOptimisticSubmission(
  milestoneId: string,
  payload: SubmitAgencyMilestonePayload,
  rawMetricValue: string,
  targetTitle: MilestoneTargetTitle
): AgencyMilestoneSubmissionItem {
  const metricValue = parseMetricValue(rawMetricValue);

  return {
    id: `temp-${Date.now()}`,
    submissionDescription: payload.description || null,
    submissionAttachments: payload.proofAttachments,
    submissionLiveLinks: payload.liveLinks,
    requestedAmount: payload.requestPaymentAmount.toFixed(2),
    submittedByRole: "agency",
    rejectionReason: null,
    isClientApproved: false,
    achievedReach: targetTitle === "Reach" ? metricValue : null,
    achievedViews: targetTitle === "Views" ? metricValue : null,
    achievedLikes: targetTitle === "Likes" ? metricValue : null,
    achievedComments: targetTitle === "Comments" ? metricValue : null,
    achievedFollows: targetTitle === "Follows" ? metricValue : null,
    paidAmount: "0.00",
    paymentStatus: "unpaid",
    adminFeedback: null,
    status: "in_review",
    assignmentId: null,
    milestoneId,
    assignedMilestoneId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const SubmissionForm = ({ milestoneId, onSubmitted }: SubmissionFormProps) => {
  const [statusByIndex, setStatusByIndex] = useState<StatusByIndex>({});
  const [submittingIndex, setSubmittingIndex] = useState<number | null>(null);
  const [milestoneDetails, setMilestoneDetails] =
    useState<AgencyMilestoneDetails | null>(null);
  const [isMilestoneLoading, setIsMilestoneLoading] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      submissions: [defaultSubmission],
    },
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

  const handleSubmitSingle = async (index: number) => {
    const isValid = await form.trigger(`submissions.${index}`);

    if (!isValid) return;

    if (!targetConfig) {
      toast.error("Milestone target information is missing.");
      return;
    }

    const submission = form.getValues(`submissions.${index}`);
    const requestPaymentAmount = parseAmount(submission.paymentAmount);

    if (!Number.isFinite(requestPaymentAmount) || requestPaymentAmount <= 0) {
      form.setError(`submissions.${index}.paymentAmount`, {
        type: "manual",
        message: "Enter a valid payment amount",
      });
      return;
    }

    const liveLinks = submission.proofs
      .map((proof) => proof.liveLink?.trim())
      .filter(Boolean);

    const proofAttachments = submission.proofs
      .map((proof) =>
        typeof proof.attachment === "string" ? proof.attachment.trim() : ""
      )
      .filter(Boolean);

    const payload: SubmitAgencyMilestonePayload = {
      description: submission.description?.trim() || "",
      liveLinks,
      proofAttachments,
      requestPaymentAmount,
      targetTitle: targetConfig.targetTitle,
      targetAmount: targetConfig.targetAmount,
    };

    try {
      setSubmittingIndex(index);

      const response = await milestoneSubmissionService.submitMilestone(
        milestoneId,
        payload
      );

      const optimisticSubmission = buildOptimisticSubmission(
        milestoneId,
        payload,
        submission.proofs[0]?.performanceMetric ?? "",
        targetConfig.targetTitle
      );

      setStatusByIndex((prev) => ({
        ...prev,
        [index]: "In Review",
      }));

      onSubmitted?.(optimisticSubmission);

      toast.success(
        typeof response.message === "string"
          ? response.message
          : "Submission sent successfully."
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to submit milestone.";

      toast.error(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
    } finally {
      setSubmittingIndex(null);
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

            return (
              <div key={field.id} className="rounded-xl border p-4">
                <Accordion type="single" collapsible defaultValue={`submission-${index}`}>
                  <AccordionItem value={`submission-${index}`}>
                    <AccordionTrigger className="flex cursor-pointer justify-between hover:no-underline">
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-semibold text-Primary">
                          Submission {index + 1}
                        </p>
                        {statusByIndex[index] && (
                          <Badge className="bg-orange/30 text-orange">
                            {statusByIndex[index]}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="space-y-4 px-2">
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

                                {submissionFields.length > 1 && (
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
                                <Input placeholder="৳3,000" {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <SubmissionProofs
                          control={form.control}
                          submissionIndex={index}
                        />

                        <div className="flex items-center gap-2">
                          <Checkbox id={ownershipId} />
                          <Label htmlFor={ownershipId} className="text-gray-400">
                            Confirm you own all the submitted assets & links
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox id={termsId} />
                          <Label htmlFor={termsId} className="text-gray-400">
                            You accept the{" "}
                            <Link
                              href="/"
                              className="text-light-green hover:underline"
                            >
                              user license agreement
                            </Link>{" "}
                            &{" "}
                            <Link
                              href="/"
                              className="text-light-green hover:underline"
                            >
                              Terms and condition
                            </Link>{" "}
                            of our platform
                          </Label>
                        </div>

                        <Button
                          type="button"
                          onClick={() => void handleSubmitSingle(index)}
                          disabled={isSubmitting || isMilestoneLoading}
                          className="w-full bg-light-green hover:bg-light-green/90"
                        >
                          {isSubmitting ? "Submitting..." : "Submit for Admin Review"}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => append(defaultSubmission)}
          className="mt-2 w-full cursor-pointer rounded-lg border border-dashed border-light-green py-6 font-semibold text-light-green transition-all duration-150 hover:bg-light-green hover:text-white"
        >
          + Add Another Submission
        </button>
      </>
    </Form>
  );
};

export default SubmissionForm;