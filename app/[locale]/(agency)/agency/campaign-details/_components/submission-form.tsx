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
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import SubmissionProofs from "./submission-proof";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import SubmissionText from "./submission-form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  submissions: z.array(
    z.object({
      description: z.string().optional(),
      paymentAmount: z.string().min(1, "Payment amount required"),
      proofs: z.array(
        z.object({
          liveLink: z.string().url("Invalid link"),
          performanceMetric: z.string().min(1),
          attachment: z.any().optional(),
        })
      ),
    })
  ),
});

export type FormType = z.infer<typeof formSchema>;

const SubmissionForm = () => {
  const [status, setStatus] = useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      submissions: [
        {
          description: "",
          paymentAmount: "",
          proofs: [
            {
              attachment: "",
              liveLink: "",
              performanceMetric: "",
            },
          ],
        },
      ],
    },
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
                      Submission {index + 1}
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
                      {/* Description */}
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
                                  variant={"outline"}
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

                      {/* Payment Amount */}
                      <FormField
                        control={form.control}
                        name={`submissions.${index}.paymentAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg flex items-center gap-2">
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

                      {/* Proofs (dynamic, already correct) */}
                      <SubmissionProofs
                        control={form.control}
                        submissionIndex={index}
                      />

                      <div className="flex items-center gap-2">
                        <Checkbox id="ownership" />
                        <Label htmlFor="ownership" className="text-gray-400">
                          Confirm you own all the submitted assets & links{" "}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-gray-400">
                          You accept the{" "}
                          <Link
                            href={"/"}
                            className="text-light-green hover:underline"
                          >
                            user license agreement
                          </Link>
                          &
                          <Link
                            href={"/"}
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
                performanceMetric: "",
                attachment: "",
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
