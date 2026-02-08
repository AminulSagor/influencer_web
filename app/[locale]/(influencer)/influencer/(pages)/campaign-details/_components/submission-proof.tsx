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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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

function isFile(v: unknown): v is File {
  return typeof File !== "undefined" && v instanceof File;
}

function FilePreview({ file }: { file?: File }) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file) {
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

  const fileType = file.type;

  if (fileType.startsWith("image/") && previewUrl) {
    return (
      <img
        src={previewUrl}
        alt="Preview"
        className="h-28 object-contain rounded-md"
      />
    );
  }

  if (fileType.startsWith("video/") && previewUrl) {
    return <video src={previewUrl} controls className="h-28 rounded-md" />;
  }

  if (fileType === "application/pdf") {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-medium text-light-green">📄 PDF Selected</span>
        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
          {file.name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm font-medium text-light-green">📎 File Selected</span>
      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
        {file.name}
      </span>
    </div>
  );
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
                <FormField
                  control={control}
                  name={`submissions.${submissionIndex}.proofs.${proofIndex}.attachment`}
                  render={({ field }) => {
                    const file = isFile(field.value) ? field.value : undefined;

                    return (
                      <FormItem>
                        <FormLabel>Attach Proof (Screenshots, Videos)</FormLabel>

                        <FormControl>
                          <label className="group cursor-pointer">
                            <div className="flex flex-col items-center justify-center gap-2 w-full h-40 border-2 border-dashed rounded-xl border-light-green bg-light-green/5 hover:bg-light-green/10 transition">
                              <FilePreview file={file} />
                            </div>

                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,video/*,.pdf,.doc,.docx"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) field.onChange(f);
                              }}
                            />
                          </label>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
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

export default SubmissionProofs;
