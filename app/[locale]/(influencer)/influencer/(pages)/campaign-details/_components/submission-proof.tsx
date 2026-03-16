"use client";

import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TrashIcon,
  UploadCloud,
  Eye,
  Play,
  Heart,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useFileUpload } from "@/hooks/useFileUpload";
import type { FormType, PerformanceMetric, Proof } from "./submission-form";

interface Props {
  control: Control<FormType>;
  submissionIndex: number;
}

const metricItems: Array<{
  key: keyof PerformanceMetric;
  label: string;
  icon: React.ElementType;
}> = [
  { key: "reach", label: "Reach", icon: Eye },
  { key: "views", label: "Views", icon: Play },
  { key: "likes", label: "Likes", icon: Heart },
  { key: "comments", label: "Comments", icon: MessageCircle },
];

function AttachmentPreview({ value }: { value?: unknown }) {
  if (!value) {
    return (
      <>
        <UploadCloud className="h-8 w-8 text-light-green" />
        <p className="text-sm font-medium text-primary">
          Click to upload or drag &amp; drop
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, PDF, DOC (max 10MB)
        </p>
      </>
    );
  }

  // Uploaded URL string
  if (typeof value === "string") {
    const isImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(value);
    if (isImage) {
      return (
        <img
          src={value}
          alt="Uploaded proof"
          className="h-28 object-contain rounded-md"
        />
      );
    }
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-medium text-light-green">File Uploaded</span>
        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
          {value.split("/").pop()}
        </span>
      </div>
    );
  }

  return null;
}

const SubmissionProofs = ({ control, submissionIndex }: Props) => {
  const proofsPath = `submissions.${submissionIndex}.proofs` as const;

  const { fields, append, remove } = useFieldArray({
    control,
    name: proofsPath,
  });

  const appendDefaultProof = () =>
    append({
      liveLink: "",
      attachment: undefined,
      performanceMetric: {
        reach: undefined,
        views: undefined,
        likes: undefined,
        comments: undefined,
      },
    } satisfies Proof);

  return (
    <div className="space-y-4">
      {fields.map((field, proofIndex) => (
        <Card key={field.id}>
          <CardContent className="space-y-4">
            {/* Remove proof */}
            <div className="flex justify-end">
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => remove(proofIndex)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex flex-col xl:flex-row gap-4 xl:gap-20">
              <div className="flex-1 space-y-4">
                {/* Live Link */}
                <FormField
                  control={control}
                  name={`submissions.${submissionIndex}.proofs.${proofIndex}.liveLink`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add Live Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram/p/acc..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Performance Metric */}
                <FormItem>
                  <FormLabel>Performance Metrics</FormLabel>
                  <FormControl>
                    <div className="grid md:grid-cols-2 gap-4">
                      {metricItems.map(({ key, label, icon: Icon }) => (
                        <FormField
                          key={String(key)}
                          control={control}
                          name={`submissions.${submissionIndex}.proofs.${proofIndex}.performanceMetric.${key}`}
                          render={({ field }) => (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                              </div>

                              <Input
                                type="number"
                                placeholder="0"
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  field.onChange(v === "" ? undefined : Number(v));
                                }}
                              />
                            </div>
                          )}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>

              <div className="flex-1">
                <ProofAttachmentField
                  control={control}
                  submissionIndex={submissionIndex}
                  proofIndex={proofIndex}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add another proof */}
      <button
        type="button"
        className="border border-light-green rounded-lg border-dashed py-6 w-full text-light-green font-semibold cursor-pointer transition-all duration-150"
        onClick={appendDefaultProof}
      >
        + Add Another Live Links
      </button>
    </div>
  );
};

// Separated component so each proof can have its own upload state
function ProofAttachmentField({
  control,
  submissionIndex,
  proofIndex,
}: {
  control: Control<FormType>;
  submissionIndex: number;
  proofIndex: number;
}) {
  const { upload, isUploading, progress } = useFileUpload({
    module: "brandguru/influencer/submissions",
  });

  return (
    <FormField
      control={control}
      name={`submissions.${submissionIndex}.proofs.${proofIndex}.attachment`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Attach Proof (Screenshots, Videos)</FormLabel>

          <FormControl>
            <label className={`group ${isUploading ? "pointer-events-none" : "cursor-pointer"}`}>
              <div className="flex flex-col items-center justify-center gap-2 w-full h-40 border-2 border-dashed rounded-xl border-light-green bg-light-green/5 hover:bg-light-green/10 transition">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 w-3/4">
                    <Loader2 className="h-6 w-6 animate-spin text-light-green" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                    <Progress value={progress} className="h-2" />
                  </div>
                ) : (
                  <AttachmentPreview value={field.value} />
                )}
              </div>

              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const result = await upload(f);
                  if (result) {
                    field.onChange(result.publicUrl);
                  }
                }}
              />
            </label>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SubmissionProofs;
