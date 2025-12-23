"use client";
import { Control, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FormType } from "./submission-form";

interface Props {
  control: Control<FormType>;
  submissionIndex: number;
}

const SubmissionProofs = ({ control, submissionIndex }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `submissions.${submissionIndex}.proofs`,
  });

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

            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                {" "}
                {/* Live Link */}
                <FormField
                  control={control}
                  name={`submissions.${submissionIndex}.proofs.${proofIndex}.liveLink`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Performance Metric */}
                <FormField
                  control={control}
                  name={`submissions.${submissionIndex}.proofs.${proofIndex}.performanceMetric`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performance Metrics</FormLabel>
                      <FormControl>
                        <Input placeholder="Reach / Likes / Views" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={control}
                  name={`submissions.${submissionIndex}.proofs.${proofIndex}.attachment`}
                  render={({ field }) => {
                    const file = field.value as File | undefined;
                    const previewUrl = file ? URL.createObjectURL(file) : null;
                    const fileType = file?.type;

                    return (
                      <FormItem>
                        <FormLabel>
                          Attach Proof (Screenshots, Videos)
                        </FormLabel>

                        <FormControl>
                          <label className="group cursor-pointer">
                            <div className="flex flex-col items-center justify-center gap-2 w-full h-40 border-2 border-dashed rounded-xl border-light-green bg-light-green/5 hover:bg-light-green/10 transition">
                              {/* 🔹 PREVIEW AREA */}
                              {file && previewUrl ? (
                                <>
                                  {fileType?.startsWith("image/") && (
                                    <img
                                      src={previewUrl}
                                      alt="Preview"
                                      className="h-28 object-contain rounded-md"
                                      onLoad={() =>
                                        URL.revokeObjectURL(previewUrl)
                                      }
                                    />
                                  )}

                                  {fileType?.startsWith("video/") && (
                                    <video
                                      src={previewUrl}
                                      controls
                                      className="h-28 rounded-md"
                                      onLoadedData={() =>
                                        URL.revokeObjectURL(previewUrl)
                                      }
                                    />
                                  )}

                                  {fileType === "application/pdf" && (
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="text-sm font-medium text-light-green">
                                        📄 PDF Selected
                                      </span>
                                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {file.name}
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <UploadCloud className="h-8 w-8 text-light-green" />
                                  <p className="text-sm font-medium text-primary">
                                    Click to upload or drag & drop
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    PNG, JPG, PDF, DOC (max 10MB)
                                  </p>
                                </>
                              )}
                            </div>

                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,video/*,.pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) field.onChange(file);
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
        className="border border-light-green rounded-lg border-dashed py-6 w-full text-light-green font-semibold cursor-pointer hover:bg-light-green hover:text-white transition-all duration-150"
        onClick={() =>
          append({
            liveLink: "",
            performanceMetric: "",
            attachment: "",
          })
        }
      >
        + Add Another Proof
      </button>
    </div>
  );
};

export default SubmissionProofs;
