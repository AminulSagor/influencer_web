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
  BarChart3,
  LinkIcon,
  Images,
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

function isImageUrl(value: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)(?:[^/?#]*)?(?:$|[?#])/i.test(
    value
  );
}

function AttachmentPreview({ value }: { value?: unknown }) {
  if (!value) {
    return (
      <>
        <UploadCloud className="h-7 w-7 text-gray-400" />
        <p className="text-sm font-medium text-gray-500">Tap to</p>
        <p className="text-sm font-medium text-gray-500">Upload Files</p>
      </>
    );
  }

  if (typeof value === "string") {
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
    <Card className="border-0 shadow-none">
      <CardContent className="grid grid-cols-1 gap-8 p-0 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-base font-semibold text-black">
              <LinkIcon className="h-5 w-5" />
              <span>Add Live Links</span>
            </div>

            {liveLinkFields.map((linkField, linkIndex) => (
              <FormField
                key={linkField.id}
                control={control}
                name={`submissions.${submissionIndex}.liveLinks.${linkIndex}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="https://instagram.com/p/acc..."
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

          <FormItem>
            <FormLabel className="flex items-center gap-2 text-base font-semibold text-black">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {metricItems.map(({ key, label, icon: Icon }) => (
                  <FormField
                    key={String(key)}
                    control={control}
                    name={`submissions.${submissionIndex}.performanceMetric.${key}`}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-black">
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </div>

                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          className="h-11 rounded-xl"
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-base font-semibold text-black">
            <Images className="h-5 w-5" />
            <span>Attach Proof (Screenshots, Videos)</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <div className="flex h-36 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:bg-light-green/10 sm:h-40">
                  {isUploading ? (
                    <div className="flex w-3/4 flex-col items-center gap-2">
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
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SubmissionProofs;
