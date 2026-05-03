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
  Plus,
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
import type { FormType, PerformanceMetric } from "./submission-form";

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
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)(\?|#|$)/i.test(value);
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
      </div>
    );
  }

  return null;
}

const SubmissionProofs = ({ control, submissionIndex }: Props) => {
  const {
    fields: liveLinkFields,
    append: appendLiveLink,
    remove: removeLiveLink,
  } = useFieldArray({
    control,
    name: `submissions.${submissionIndex}.liveLinks` as const,
  });

  const {
    fields: attachmentFields,
    append: appendAttachment,
    remove: removeAttachment,
  } = useFieldArray({
    control,
    name: `submissions.${submissionIndex}.attachments` as const,
  });

  return (
    <Card>
      <CardContent className="space-y-5 p-4">
        <div className="space-y-3">
          {liveLinkFields.map((linkField, linkIndex) => (
            <FormField
              key={linkField.id}
              control={control}
              name={`submissions.${submissionIndex}.liveLinks.${linkIndex}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Live Link</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="https://instagram.com/p/acc..."
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => appendLiveLink({ url: "" })}
                        className="h-9 w-9 border-light-green text-light-green hover:bg-light-green hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      {liveLinkFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeLiveLink(linkIndex)}
                          className="h-9 w-9"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Performance Metric */}
        <FormItem>
          <FormLabel>Performance Metrics</FormLabel>
          <FormControl>
            <div className="grid gap-4 md:grid-cols-2">
              {metricItems.map(({ key, label, icon: Icon }) => (
                <FormField
                  key={String(key)}
                  control={control}
                  name={`submissions.${submissionIndex}.performanceMetric.${key}`}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </div>

                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0, 10K or 1M"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value.toUpperCase();
                          if (/^[0-9.,]*[KM]?$/.test(v) || v === "") {
                            field.onChange(v === "" ? undefined : v);
                          }
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {attachmentFields.map((attachmentField, attachmentIndex) => (
            <ProofAttachmentField
              key={attachmentField.id}
              control={control}
              submissionIndex={submissionIndex}
              attachmentIndex={attachmentIndex}
              canRemove={attachmentFields.length > 1}
              onRemove={() => removeAttachment(attachmentIndex)}
            />
          ))}
        </div>

        {/* Add another proof */}
        <button
          type="button"
          className="w-full cursor-pointer rounded-lg border border-dashed border-light-green py-6 font-semibold text-light-green transition-all duration-150 hover:bg-light-green hover:text-white"
          onClick={() => appendAttachment({ attachment: "" })}
        >
          + Add Another Proof
        </button>
      </CardContent>
    </Card>
  );
};

// Separated component so each proof can have its own upload state
function ProofAttachmentField({
  control,
  submissionIndex,
  attachmentIndex,
  canRemove,
  onRemove,
}: {
  control: Control<FormType>;
  submissionIndex: number;
  attachmentIndex: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const { upload, isUploading, progress } = useFileUpload({
    module: "brandguru/influencer/submissions",
  });

  return (
    <FormField
      control={control}
      name={`submissions.${submissionIndex}.attachments.${attachmentIndex}.attachment`}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between gap-2">
            <FormLabel>Attach Proof (Screenshots, Videos)</FormLabel>
            {canRemove && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onRemove}
                className="h-8 w-8"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          <FormControl>
            <label className={`group block ${isUploading ? "pointer-events-none" : "cursor-pointer"}`}>
              <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-light-green bg-light-green/5 text-center transition hover:bg-light-green/10">
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
                  e.target.value = "";
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
