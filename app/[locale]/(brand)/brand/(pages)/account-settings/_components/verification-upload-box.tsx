"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileText, Upload, XCircle } from "lucide-react";

type Props = {
  title: string;
  hint: string;
  inputId: string;
  accept: string;
  isEditing: boolean;
  isSaving: boolean;
  file: File | null;
  previewUrl: string;
  existingUrl: string;
  uploadedName: string;
  error?: string;
  onPick: (file: File | null) => void;
  onRemove: () => void;
};

const VerificationUploadBox = ({
  title,
  hint,
  inputId,
  accept,
  isEditing,
  isSaving,
  file,
  previewUrl,
  existingUrl,
  uploadedName,
  error,
  onPick,
  onRemove,
}: Props) => {
  const t = useTranslations("brand.profile");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const hasFile = !!file || !!existingUrl;

  const handleOpenPicker = () => {
    if (!isEditing || isSaving) return;
    inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isEditing || isSaving) return;
    const selectedFile = e.dataTransfer.files?.[0] ?? null;
    onPick(selectedFile);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-orange">{title}</p>

      <div
        role="button"
        tabIndex={isEditing ? 0 : -1}
        onClick={handleOpenPicker}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && isEditing) {
            handleOpenPicker();
          }
        }}
        className={[
          "min-h-[140px] w-full rounded-lg border border-dashed border-black/10 bg-muted/30 transition",
          "flex cursor-pointer select-none items-center justify-center",
          isEditing ? "hover:bg-muted/40" : "cursor-default opacity-95",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />

        {!hasFile ? (
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-black/5">
              <Upload className="h-5 w-5 text-black/40" />
            </div>
            <p className="text-xs text-black/50">{hint}</p>
          </div>
        ) : (
          <div className="w-full px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-black/70">
                  {t("verification.uploaded")}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="truncate">{uploadedName}</span>
                </div>
              </div>

              {isEditing ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="h-9 w-9 p-0 hover:bg-black/5"
                >
                  <XCircle className="h-4 w-4 text-black/40" />
                </Button>
              ) : null}
            </div>

            {previewUrl ? (
              <div className="mt-3 overflow-hidden rounded-md border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={title}
                  className="h-28 w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        )}
      </div>

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
};

export default VerificationUploadBox;