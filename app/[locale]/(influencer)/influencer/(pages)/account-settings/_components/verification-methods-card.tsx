"use client";

import React from "react";
import {
  AlertTriangle,
  SquarePen,
  ExternalLink,
  Upload,
  XCircle,
  FileText,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UploadKey = "frontNid" | "backNid";

type UploadState = {
  file: File | null;
  previewUrl?: string;
};

const MAX_MB = 2;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,application/pdf";

export default function VerificationMethodsCard() {
  const [nidNumber, setNidNumber] = React.useState("");

  const [uploads, setUploads] = React.useState<Record<UploadKey, UploadState>>({
    frontNid: { file: null },
    backNid: { file: null },
  });

  const [errors, setErrors] = React.useState<
    Partial<Record<UploadKey, string>>
  >({});

  React.useEffect(() => {
    return () => {
      Object.values(uploads).forEach((u) => {
        if (u.previewUrl) URL.revokeObjectURL(u.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateFile = (file: File) => {
    if (file.size > MAX_BYTES) return `Max ${MAX_MB}MB allowed`;
    const okTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!okTypes.includes(file.type)) return "Only PNG, JPEG, PDF allowed";
    return null;
  };

  const setUpload = (key: UploadKey, file: File | null) => {
    setErrors((p) => ({ ...p, [key]: undefined }));

    // clear
    if (!file) {
      setUploads((prev) => {
        const old = prev[key];
        if (old.previewUrl) URL.revokeObjectURL(old.previewUrl);
        return { ...prev, [key]: { file: null } };
      });
      return;
    }

    const err = validateFile(file);
    if (err) {
      setErrors((p) => ({ ...p, [key]: err }));
      return;
    }

    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

    setUploads((prev) => {
      const old = prev[key];
      if (old.previewUrl) URL.revokeObjectURL(old.previewUrl);
      return { ...prev, [key]: { file, previewUrl } };
    });
  };

  const openFileDialog = (key: UploadKey) => {
    const input = document.getElementById(
      `file-${key}`
    ) as HTMLInputElement | null;
    input?.click();
  };

  const onDrop = (key: UploadKey) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) setUpload(key, file);
  };

  return (
    <Card className="py-0 relative bg-white border border-black/5 rounded-xl">
      <CardContent className="py-4 px-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            {/* Header */}
            <div className="relative">
              <AccordionTrigger className="py-0 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-16">
                  <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-base text-orange">
                      Verification Methods
                    </h1>
                    <SquarePen size={15} className="text-orange" />
                  </div>
                </div>
              </AccordionTrigger>
            </div>

            <AccordionContent className="pt-4 pb-6">
              {/* Warning */}
              <div className="flex items-center gap-2 bg-[#FDECEC] text-[#E74C3C] text-sm rounded-lg px-4 py-2 mb-6 border border-[#FAD2D2]">
                <AlertTriangle className="w-4 h-4" />
                <span>Verification Required. Please Provide Documents</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* NID number */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-orange">
                    Your NID Number
                  </label>
                  <Input
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                    placeholder="Enter your NID Number"
                    className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                  />
                </div>

                {/* Front side */}
                <UploadBoxUI
                  label="Front Side of NID"
                  state={uploads.frontNid}
                  error={errors.frontNid}
                  accept={ACCEPT}
                  inputId="file-frontNid"
                  onPick={() => openFileDialog("frontNid")}
                  onRemove={() => setUpload("frontNid", null)}
                  onDrop={onDrop("frontNid")}
                  onDragOver={(e) => e.preventDefault()}
                  onChange={(f) => setUpload("frontNid", f)}
                />

                {/* Back side */}
                <UploadBoxUI
                  label="Back Side of NID"
                  state={uploads.backNid}
                  error={errors.backNid}
                  accept={ACCEPT}
                  inputId="file-backNid"
                  onPick={() => openFileDialog("backNid")}
                  onRemove={() => setUpload("backNid", null)}
                  onDrop={onDrop("backNid")}
                  onDragOver={(e) => e.preventDefault()}
                  onChange={(f) => setUpload("backNid", f)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

/* ---------------- UI Upload Box (same style as previous) ---------------- */

function UploadBoxUI({
  label,
  state,
  error,
  accept,
  inputId,
  onPick,
  onRemove,
  onDrop,
  onDragOver,
  onChange,
}: {
  label: string;
  state: UploadState;
  error?: string;
  accept: string;
  inputId: string;
  onPick: () => void;
  onRemove: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onChange: (file: File | null) => void;
}) {
  const hasFile = !!state.file;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-orange">{label}</p>

      <div
        role="button"
        tabIndex={0}
        onClick={onPick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onPick();
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={[
          "w-full rounded-lg border border-dashed",
          "bg-muted/30",
          "min-h-[140px]",
          "flex items-center justify-center",
          "cursor-pointer select-none",
          "transition",
          "hover:bg-muted/40",
          "focus:outline-none focus:ring-2 focus:ring-orange/20",
          "border-black/10",
        ].join(" ")}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />

        {!hasFile ? (
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <div className="h-11 w-11 rounded-full bg-black/5 grid place-items-center">
              <Upload className="h-5 w-5 text-black/40" />
            </div>
            <p className="text-xs text-black/50">PNG, JPEG, PDF (Max 2MB)</p>
          </div>
        ) : (
          <div className="w-full px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-black/70 truncate">
                  Uploaded
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="truncate">{state.file?.name}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="h-9 w-9 p-0 hover:bg-black/5"
                aria-label="Remove file"
                title="Remove"
              >
                <XCircle className="h-4 w-4 text-black/40" />
              </Button>
            </div>

            {state.previewUrl && (
              <div className="mt-3 rounded-md overflow-hidden border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={state.previewUrl}
                  alt="Preview"
                  className="w-full h-28 object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
