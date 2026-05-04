"use client";

import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Images,
  LinkIcon,
  Loader2,
  Plus,
  TrashIcon,
  UploadCloud,
} from "lucide-react";
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

function isImageUrl(value: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)(?:[^/?#]*)?(?:$|[?#])/i.test(
    value
  );
}

function AttachmentPreview({ value }: { value?: unknown }) {
  if (typeof value === "string" && value.trim()) {
    if (isImageUrl(value)) {
      return (
        <img
          src={value}
          alt="Uploaded proof"
          className="h-full w-full rounded-xl object-cover"
        />
      );
    }

    return (
      <div className="flex flex-col items-center gap-1 px-3 text-center">
        <UploadCloud className="h-7 w-7 text-light-green" />
        <span className="text-sm font-medium text-light-green">
          File Uploaded
        </span>
      </div>
    );
  }

  return (
    <>
      <UploadCloud className="h-7 w-7 text-gray-400" />
      <p className="text-sm font-medium text-gray-500">Tap to</p>
      <p className="text-sm font-medium text-gray-500">Upload Files</p>
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
          <FormControl>
            <div className="relative">
              {canRemove && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onRemove}
                  className="absolute right-2 top-2 z-10 h-7 w-7 bg-white/90"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </Button>
              )}

              <label
                className={`group block ${isUploading ? "pointer-events-none" : "cursor-pointer"}`}
              >
                <div className="flex h-40 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:bg-light-green/10 sm:h-44">
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
            </div>
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
    <Card className="border-0 shadow-none">
      <CardContent className="grid grid-cols-1 gap-8 p-0 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-base font-semibold text-black">
              <LinkIcon className="h-5 w-5" />
              <span>Add Live Links</span>
            </div>

            {liveLinkFields.map((field, linkIndex) => (
              <FormField
                key={field.id}
                control={control}
                name={`submissions.${submissionIndex}.liveLinks.${linkIndex}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="https://example.com"
                          className="h-11 rounded-xl"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => appendLiveLink({ url: "" })}
                          className="h-10 w-10 shrink-0 border-light-green text-light-green hover:bg-light-green hover:text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {liveLinkFields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeLiveLink(linkIndex)}
                            className="h-10 w-10 shrink-0"
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
                <FormLabel className="flex items-center gap-2 text-base font-semibold text-black">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </FormLabel>
                <FormControl>
                  <div className="flex gap-6">
                    <div className="flex h-12 min-w-[140px] items-center justify-center rounded-xl border bg-gray-200 px-6 text-sm font-semibold text-black">
                      {targetTitle ?? "Metric"}
                    </div>
                    <Input
                      inputMode="decimal"
                      placeholder="2.5M"
                      className="h-12 rounded-xl"
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-base font-semibold text-black">
            <Images className="h-5 w-5" />
            <span>Attach Proof (Screenshots, Videos)</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            className="w-full cursor-pointer rounded-lg border border-dashed border-light-green py-4 font-semibold text-light-green transition-all duration-150 hover:bg-light-green hover:text-white"
            onClick={() => appendAttachment({ attachment: "" })}
          >
            + Add Another Proof
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionProofs;
