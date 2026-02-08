"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { TrashIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import SubmissionProofs from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/submission-proof";

/* =======================
   TYPES (kept, but removed `any`)
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
  attachment?: unknown; // ✅ safer than any
};

export type Submission = {
  description?: string;
  paymentAmount?: string;
  proofs: Proof[];
};

export type FormType = {
  submissions: Submission[];
};

/* =======================
   ZOD SCHEMA (fixed)
   ✅ don't force ZodType<FormType,...> here
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
  attachment: z.unknown().optional(),
});

const submissionSchema = z.object({
  description: z.string().optional(),
  paymentAmount: z.string().optional(),
  proofs: z.array(proofSchema),
});

const formSchema = z.object({
  submissions: z.array(submissionSchema),
});

/** If you want schema-driven type as well (recommended) */
// export type FormSchemaType = z.infer<typeof formSchema>;
// (Your FormType matches this shape already.)

const defaultValues: FormType = {
  submissions: [
    {
      description: "",
      paymentAmount: "",
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
    },
  ],
};

const SubmissionForm = () => {
  const [status, setStatus] = useState("");

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const {
    fields: submissionFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "submissions",
  });

  const onSubmit = (values: FormType) => {
    setStatus("In Review");
    // eslint-disable-next-line no-console
    console.log(values, "values");
  };

  return (
    <>
      <div className="space-y-2">
        {submissionFields.map((field, index) => (
          <div key={field.id} className="border rounded-xl p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value={`submission-${index}`}>
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
                        name={`submissions.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-lg flex items-center gap-2">
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
                          </FormItem>
                        )}
                      />

                      <SubmissionProofs
                        control={form.control}
                        submissionIndex={index}
                      />

                      <div className="flex items-center gap-2">
                        <Checkbox id={`ownership-${index}`} />
                        <Label
                          htmlFor={`ownership-${index}`}
                          className="text-gray-400"
                        >
                          Confirm you own all the submitted assets &amp; links
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox id={`terms-${index}`} />
                        <Label
                          htmlFor={`terms-${index}`}
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

                      <Button
                        type="submit"
                        className="bg-light-green hover:bg-light-green/90 w-full"
                      >
                        Submit for Admin Review
                      </Button>
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          append({
            description: "",
            paymentAmount: "",
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
          })
        }
        className="border border-light-green rounded-lg border-dashed py-6 w-full text-light-green font-semibold cursor-pointer hover:bg-light-green hover:text-white transition-all duration-150"
      >
        + Add Another Submission
      </button>
    </>
  );
};

export default SubmissionForm;
export { formSchema };
