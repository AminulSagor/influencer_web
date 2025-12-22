"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { FaClock } from "react-icons/fa6";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import SubmissionProofs from "./submission-proof";

const formSchema = z.object({
  submissions: z.array(
    z.object({
      description: z.string().optional(),
      paymentAmount: z.string().min(1, "Payment amount required"),
      proofs: z.array(
        z.object({
          liveLink: z.string().url("Invalid link"),
          performanceMetric: z.string().min(1),
          attachment: z.string().min(1),
        })
      ),
    })
  ),
});

export type FormType = z.infer<typeof formSchema>;

const MileStoneCard = () => {
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
    console.log(values, "values");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <Image
                src={"/icons/milestone.svg"}
                height={24}
                width={24}
                alt="svg"
              />
            </div>
            <div>
              <p className="text-Primary">Milestone 1</p>
              <h2 className="text-Primary text-xl font-semibold">
                Initial Brand Awarness
              </h2>
            </div>
          </div>
          <div className="flex gap-6 items-center flex-1">
            <p className="text-sm font-semibold text-Primary">
              Pertial Payment <br /> Progress
            </p>
            <div className=" flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">৳0</p>
                <p className="text-sm font-semibold text-Primary">৳3000</p>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-light-green rounded-full transition-all duration-300"
                  style={{ width: `${10}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="border border-light-green rounded-lg p-4 bg-linear-to-r bg-Secondary to-white">
          <div className="flex  justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Content Requirement
              </h2>
              <ul className="list-disc text-Primary ml-5 text-sm">
                <li>2 instagram Posts + 3 Stories</li>
              </ul>
              <div className="space-y-1">
                <h2 className="text-xl font-medium text-Primary">
                  Promotion Goal
                </h2>

                <p className="text-Primary  text-sm">
                  Gain page like as much as possible
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {" "}
              <h2 className="text-xl font-medium text-Primary">
                Promotion Target
              </h2>
              <p className="text-sm text-Primary">Facebook Reach</p>
              <p className="text-2xl font-bold text-Primary">300k</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Payout On Approval
              </h2>
              <p className="text-2xl font-bold text-light-green">৳3,000</p>
            </div>
            <div className="border p-2 w-[200px] bg-linear-to-r from-off-white to-white rounded-lg border-gray-300 flex flex-col items-center justify-center gap-2">
              <p className="text-dark-gray">Status</p>
              <Badge className="bg-dark-gray px-10 py-1 text-lg">To Do</Badge>
              <div className="flex items-center gap-1">
                <span>
                  <FaClock size={12} className="fill-gray-400" />
                </span>
                <span className="text-xs text-gray-400">12 Dec, 2024</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <Accordion type="single" collapsible>
            {submissionFields.map((field, index) => (
              <AccordionItem key={field.id} value={`submission-${index}`}>
                <AccordionTrigger className="flex justify-between hover:no-underline cursor-pointer">
                  <p className="text-lg font-semibold text-Primary">
                    Submission {index + 1}
                  </p>
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
                          </FormItem>
                        )}
                      />

                      {/* Proofs (dynamic, already correct) */}
                      <SubmissionProofs
                        control={form.control}
                        submissionIndex={index}
                      />

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
            ))}
          </Accordion>
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
      </CardContent>
    </Card>
  );
};

export default MileStoneCard;
