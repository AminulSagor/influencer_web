"use client";

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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaUserEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import SubmissionProofs from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/submission-proof";
import { toast } from "sonner";
import { MilestoneService } from "@/service/influencer/milestone-service";
import type { MilestoneSubmission } from "@/types/influencer/milestone_types";

/* =======================
   TYPES
======================= */
export type MetricInputValue = string | number;

export type PerformanceMetric = {
  reach?: MetricInputValue;
  views?: MetricInputValue;
  likes?: MetricInputValue;
  comments?: MetricInputValue;
};

export type LiveLink = {
  url: string;
};

export type Attachment = {
  attachment: string;
};

export type Submission = {
  description?: string;
  liveLinks: LiveLink[];
  performanceMetric: PerformanceMetric;
  attachments: Attachment[];
  ownershipConfirmed: boolean;
  termsAccepted: boolean;
};

export type FormType = {
  submissions: Submission[];
};

/* =======================
   ZOD SCHEMA
======================= */
const metricInputSchema = z.union([z.string(), z.number()]).optional();

const performanceMetricSchema = z.object({
  reach: metricInputSchema,
  views: metricInputSchema,
  likes: metricInputSchema,
  comments: metricInputSchema,
});

const liveLinkSchema = z.object({
  url: z.string().trim().url("Invalid link"),
});

const attachmentSchema = z.object({
  attachment: z.string().trim().min(1, "Proof attachment is required"),
});

const submissionSchema = z.object({
  description: z.string().optional(),
  liveLinks: z.array(liveLinkSchema).min(1, "At least one live link is required"),
  performanceMetric: performanceMetricSchema,
  attachments: z.array(attachmentSchema).min(1, "At least one proof is required"),
  ownershipConfirmed: z.boolean().refine((v) => v === true, {
    message: "You must confirm ownership",
  }),
  termsAccepted: z.boolean().refine((v) => v === true, {
    message: "You must accept terms",
  }),
});

const formSchema = z.object({
  submissions: z.array(submissionSchema),
});

function metricToInputValue(value?: number | null): string | undefined {
  if (value === null || value === undefined) return undefined;

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return undefined;
  if (numericValue === 0) return "0";

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

function createDefaultValues(initialSubmission?: MilestoneSubmission | null): FormType {
  const liveLinks = initialSubmission?.submissionLiveLinks?.length
    ? initialSubmission.submissionLiveLinks.map((url) => ({ url }))
    : [{ url: "" }];

  const attachments = initialSubmission?.submissionAttachments?.length
    ? initialSubmission.submissionAttachments.map((attachment) => ({ attachment }))
    : [{ attachment: "" }];

  return {
    submissions: [
      {
        description: initialSubmission?.submissionDescription || "",
        liveLinks,
        performanceMetric: {
          reach: metricToInputValue(initialSubmission?.achievedReach),
          views: metricToInputValue(initialSubmission?.achievedViews),
          likes: metricToInputValue(initialSubmission?.achievedLikes),
          comments: metricToInputValue(initialSubmission?.achievedComments),
        },
        attachments,
        ownershipConfirmed: Boolean(initialSubmission),
        termsAccepted: Boolean(initialSubmission),
      },
    ],
  };
}


function formatSubmissionStatus(status?: string | null) {
  if (!status) return "In Review";

  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseMetricInput(value: MetricInputValue | undefined): number | null {
  if (value === undefined || value === null || value === "") return 0;

  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value) : null;
  }

  const normalized = value.trim().replace(/,/g, "").toUpperCase();
  if (!normalized) return 0;

  const match = normalized.match(/^(\d+(?:\.\d+)?)([KM])?$/);
  if (!match) return null;

  const base = Number(match[1]);
  if (!Number.isFinite(base)) return null;

  const multiplier = match[2] === "M" ? 1_000_000 : match[2] === "K" ? 1_000 : 1;
  return Math.round(base * multiplier);
}

interface SubmissionFormProps {
  milestoneId: string;
  onSubmitted?: () => void;
  resubmitSubmissionId?: string;
  initialSubmission?: MilestoneSubmission | null;
}

const SubmissionForm = ({
  milestoneId,
  onSubmitted,
  resubmitSubmissionId,
  initialSubmission,
}: SubmissionFormProps) => {
  const [status, setStatus] = useState(
    initialSubmission ? formatSubmissionStatus(initialSubmission.status) : ""
  );
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(initialSubmission),
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset(createDefaultValues(initialSubmission));
    setStatus(initialSubmission ? formatSubmissionStatus(initialSubmission.status) : "");
  }, [form, initialSubmission]);

  const ownershipConfirmed = form.watch("submissions.0.ownershipConfirmed");
  const termsAccepted = form.watch("submissions.0.termsAccepted");
  const canSubmit = ownershipConfirmed === true && termsAccepted === true;
  const normalizedInitialStatus = String(initialSubmission?.status ?? "").toLowerCase();
  const isInitialDeclined = ["declined", "decline", "rejected"].includes(
    normalizedInitialStatus
  );
  const showDeclinedReason =
    isInitialDeclined && Boolean(initialSubmission?.rejectionReason?.trim());
  const statusBadgeClass = isInitialDeclined
    ? "bg-[#FF1616] text-white"
    : "bg-orange/30 text-orange";

  const onSubmit = async (values: FormType) => {
    try {
      setSubmitting(true);
      const submission = values.submissions[0];
      if (!submission) return;

      const liveLinks = submission.liveLinks
        .map((item) => item.url.trim())
        .filter(Boolean);
      const proofAttachments = submission.attachments
        .map((item) => item.attachment.trim())
        .filter(Boolean);

      const achievedViews = parseMetricInput(submission.performanceMetric.views);
      const achievedReach = parseMetricInput(submission.performanceMetric.reach);
      const achievedLikes = parseMetricInput(submission.performanceMetric.likes);
      const achievedComments = parseMetricInput(submission.performanceMetric.comments);

      const metricErrors = [
        { value: achievedReach, path: "submissions.0.performanceMetric.reach" },
        { value: achievedViews, path: "submissions.0.performanceMetric.views" },
        { value: achievedLikes, path: "submissions.0.performanceMetric.likes" },
        { value: achievedComments, path: "submissions.0.performanceMetric.comments" },
      ];

      const invalidMetric = metricErrors.find((item) => item.value === null);
      if (invalidMetric) {
        form.setError(invalidMetric.path as any, {
          type: "manual",
          message: "Use a number, 10K, or 1M",
        });
        toast.error("Use a number, 10K, or 1M for metrics.");
        return;
      }

      const payload = {
        description: submission.description || "",
        liveLinks,
        proofAttachments,
        achievedViews: achievedViews ?? 0,
        achievedReach: achievedReach ?? 0,
        achievedLikes: achievedLikes ?? 0,
        achievedComments: achievedComments ?? 0,
      };

      if (resubmitSubmissionId) {
        await MilestoneService.resubmitMilestone(resubmitSubmissionId, payload);
        toast.success("Milestone resubmitted successfully!");
      } else {
        await MilestoneService.submitMilestone(milestoneId, payload);
        toast.success("Milestone submitted for review!");
      }

      setStatus("In Review");
      onSubmitted?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className={`rounded-xl border p-4 ${isInitialDeclined ? "border-[#FF1616]" : ""}`}>
        <Accordion type="single" collapsible defaultValue="submission-0">
          <AccordionItem value="submission-0">
            <AccordionTrigger className="flex justify-between hover:no-underline cursor-pointer">
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold text-Primary">
                  Your Submission
                </p>
                {status && (
                  <Badge className={statusBadgeClass}>
                    {isInitialDeclined ? "Declined" : status}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="px-2 space-y-4"
                >
                  <div
                    className={`grid grid-cols-1 gap-4 ${
                      showDeclinedReason ? "lg:grid-cols-2" : ""
                    }`}
                  >
                    <FormField
                      control={form.control}
                      name="submissions.0.description"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-lg flex items-center gap-2">
                              <FaUserEdit size={20} />
                              Description / Update (Optional)
                            </FormLabel>
                          </div>

                          <FormControl>
                            <Textarea
                              placeholder="Write Description"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {showDeclinedReason ? (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-[#FF1616]">
                          Declined Reason
                        </p>
                        <div className="min-h-[112px] rounded-[10px] border border-[#FF1616] bg-white p-4 text-sm leading-relaxed text-black/80">
                          {initialSubmission?.rejectionReason?.trim() ||
                            "Declined reason will be visible here"}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <SubmissionProofs
                    control={form.control}
                    submissionIndex={0}
                  />

                  <FormField
                    control={form.control}
                    name="submissions.0.ownershipConfirmed"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              id="ownership-0"
                              checked={field.value === true}
                              onCheckedChange={(checked) =>
                                field.onChange(checked === true)
                              }
                            />
                          </FormControl>
                          <Label
                            htmlFor="ownership-0"
                            className="text-gray-400"
                          >
                            Confirm you own all the submitted assets &amp; links
                          </Label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="submissions.0.termsAccepted"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              id="terms-0"
                              checked={field.value === true}
                              onCheckedChange={(checked) =>
                                field.onChange(checked === true)
                              }
                            />
                          </FormControl>
                          <Label
                            htmlFor="terms-0"
                            className="text-gray-400"
                          >
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
                    type="submit"
                    disabled={submitting || !canSubmit}
                    className="bg-light-green hover:bg-light-green/90 w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? "Submitting..."
                      : resubmitSubmissionId
                      ? "Resubmit for Admin Review"
                      : "Submit for Admin Review"}
                  </Button>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SubmissionForm;
export { formSchema };
