"use client";

import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, TrashIcon, UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { getSignedUrl } from "@/service/common/upload/get-signed-url";
import { uploadFileToS3 } from "@/service/common/upload/upload-file-to-s3";
import type { FormType } from "./submission-form";
import type { MilestoneTargetTitle } from "@/types/agency/campaign/milestone-submission.types";

interface Props {
  control: Control<FormType>;
  submissionIndex: number;
  targetTitle?: MilestoneTargetTitle;
}

function AttachmentPreview({ value }: { value?: unknown }) {
  if (typeof value === "string" && value.trim()) {
    const isImage = /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(value);

    if (isImage) {
      return (
        <img
          src={value}
          alt="Uploaded proof"
          className="h-28 rounded-md object-contain"
        />
      );
    }

    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-medium text-light-green">
          File Uploaded
        </span>
        <span className="max-w-[220px] truncate text-xs text-muted-foreground">
          {value.split("/").pop()}
        </span>
      </div>
    );
  }

  return (
    <>
      <UploadCloud className="h-8 w-8 text-light-green" />
      <p className="text-sm font-medium text-primary">
        Click to upload or drag & drop
      </p>
      <p className="text-xs text-muted-foreground">
        PNG, JPG, PDF, DOC (max 10MB)
      </p>
    </>
  );
}

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
  const [isUploading, setIsUploading] = useState(false);

  const uploadAttachment = async (file: File) => {
    setIsUploading(true);

    try {
      const signedUrlResponse = await getSignedUrl({
        fileName: file.name,
        fileType: file.type,
        module: "brandguru/agency/submissions",
      });

      await uploadFileToS3(signedUrlResponse.signedUrl, file);

      return signedUrlResponse.publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

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
            <label
              className={`group block ${isUploading ? "pointer-events-none" : "cursor-pointer"}`}
            >
              <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-light-green bg-light-green/5 text-center transition hover:bg-light-green/10">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-light-green" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <AttachmentPreview value={field.value} />
                )}
              </div>

              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  try {
                    const publicUrl = await uploadAttachment(file);
                    field.onChange(publicUrl);
                  } catch {
                    field.onChange("");
                  } finally {
                    event.target.value = "";
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

const SubmissionProofs = ({ control, submissionIndex, targetTitle }: Props) => {
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
          {liveLinkFields.map((field, linkIndex) => (
            <FormField
              key={field.id}
              control={control}
              name={`submissions.${submissionIndex}.liveLinks.${linkIndex}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Link</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input placeholder="https://example.com" {...field} />
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

        <FormField
          control={control}
          name={`submissions.${submissionIndex}.performanceMetric`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performance Metrics</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex h-9 min-w-[140px] items-center justify-center rounded-md border bg-gray-200 px-6 text-sm font-medium text-black">
                    {targetTitle ?? "Metric"}
                  </div>
                  <Input
                    inputMode="decimal"
                    placeholder="2.5M"
                    className="h-9"
                    {...field}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^0-9.,kKmM]/g, "");
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {attachmentFields.map((field, attachmentIndex) => (
            <ProofAttachmentField
              key={field.id}
              control={control}
              submissionIndex={submissionIndex}
              attachmentIndex={attachmentIndex}
              canRemove={attachmentFields.length > 1}
              onRemove={() => removeAttachment(attachmentIndex)}
            />
          ))}
        </div>

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

export default SubmissionProofs;
