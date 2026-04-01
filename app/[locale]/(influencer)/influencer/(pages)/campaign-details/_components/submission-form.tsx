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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import SubmissionProofs from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/submission-proof";
import { toast } from "sonner";
import { MilestoneService } from "@/service/influencer/milestone-service";

/* =======================
   TYPES
======================= */
export type PerformanceMetric = {
  reach?: number;
  views?: number;
  likes?: number;
  comments?: number;
};

export type Proof = {
  liveLink: string;
  performanceMetric: PerformanceMetric;
  attachment?: string;
};

export type Submission = {
  description?: string;
  proofs: Proof[];
  ownershipConfirmed: boolean;
  termsAccepted: boolean;
};

export type FormType = {
  submissions: Submission[];
};

/* =======================
   ZOD SCHEMA
======================= */
const performanceMetricSchema = z.object({
  reach: z.number().optional(),
  views: z.number().optional(),
  likes: z.number().optional(),
  comments: z.number().optional(),
});

const proofSchema = z.object({
  liveLink: z.string().url("Invalid link"),
  performanceMetric: performanceMetricSchema,
  attachment: z.string().optional(),
});

const submissionSchema = z.object({
  description: z.string().optional(),
  proofs: z.array(proofSchema),
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

const defaultValues: FormType = {
  submissions: [
    {
      description: "",
      proofs: [
        {
          liveLink: "",
          attachment: undefined,
          performanceMetric: {
            reach: undefined,
            views: undefined,
            likes: undefined,
            comments: undefined,
          },
        },
      ],
      ownershipConfirmed: false as unknown as true,
      termsAccepted: false as unknown as true,
    },
  ],
};

interface SubmissionFormProps {
  milestoneId: string;
  onSubmitted?: () => void;
  resubmitSubmissionId?: string;
}

const SubmissionForm = ({ milestoneId, onSubmitted, resubmitSubmissionId }: SubmissionFormProps) => {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = async (values: FormType) => {
    try {
      setSubmitting(true);
      const submission = values.submissions[0];
      if (!submission) return;

      const liveLinks = submission.proofs.map((p) => p.liveLink).filter(Boolean);
      const proofAttachments = submission.proofs
        .map((p) => p.attachment)
        .filter((a): a is string => typeof a === "string" && a.length > 0);
      const achievedReach = submission.proofs.reduce((sum, p) => sum + (p.performanceMetric.reach || 0), 0);
      const achievedViews = submission.proofs.reduce((sum, p) => sum + (p.performanceMetric.views || 0), 0);
      const achievedLikes = submission.proofs.reduce((sum, p) => sum + (p.performanceMetric.likes || 0), 0);
      const achievedComments = submission.proofs.reduce((sum, p) => sum + (p.performanceMetric.comments || 0), 0);

      const payload = {
        description: submission.description || "",
        liveLinks,
        proofAttachments,
        achievedViews,
        achievedReach,
        achievedLikes,
        achievedComments,
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
      <div className="border rounded-xl p-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="submission-0">
            <AccordionTrigger className="flex justify-between hover:no-underline cursor-pointer">
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold text-Primary">
                  Your Submission
                </p>
                {status && (
                  <Badge className="bg-orange/30 text-orange">
                    {status}
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
                    disabled={submitting}
                    className="bg-light-green hover:bg-light-green/90 w-full"
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
