"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, XCircle, FileText, ExternalLink } from "lucide-react";

type UploadFieldKey =
  | "nidFront"
  | "nidBack"
  | "tradeLicense"
  | "tinCertificate";

type UploadFileState = {
  file?: File | null;
  previewUrl?: string; // image preview only
};

const MAX_MB = 2;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const ACCEPT = {
  imagesAndPdf: "image/png,image/jpeg,application/pdf",
};

export default function VerificationMethodsCard() {
  const [nidNumber, setNidNumber] = React.useState("");
  const [tradeLicenseNumber, setTradeLicenseNumber] = React.useState("");
  const [tinNumber, setTinNumber] = React.useState("");
  const [binNumber, setBinNumber] = React.useState("");

  const [uploads, setUploads] = React.useState<Record<UploadFieldKey, UploadFileState>>({
    nidFront: {},
    nidBack: {},
    tradeLicense: {},
    tinCertificate: {},
  });

  const [errors, setErrors] = React.useState<Partial<Record<UploadFieldKey, string>>>(
    {}
  );

  const [bannerError, setBannerError] = React.useState<string | null>(
    "Verification Required. Please Provide Documents"
  );

  React.useEffect(() => {
    return () => {
      // cleanup previews
      Object.values(uploads).forEach((u) => {
        if (u.previewUrl) URL.revokeObjectURL(u.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateFile = (file: File) => {
    if (file.size > MAX_BYTES) return `Max ${MAX_MB}MB allowed`;
    const okTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
    ];
    if (!okTypes.includes(file.type)) return "Only PNG, JPEG, PDF allowed";
    return null;
  };

  const setUpload = (key: UploadFieldKey, file: File | null) => {
    setErrors((p) => ({ ...p, [key]: undefined }));

    if (!file) {
      setUploads((prev) => {
        const old = prev[key];
        if (old?.previewUrl) URL.revokeObjectURL(old.previewUrl);
        return { ...prev, [key]: {} };
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
      if (old?.previewUrl) URL.revokeObjectURL(old.previewUrl);
      return {
        ...prev,
        [key]: { file, previewUrl },
      };
    });
  };

  const onDrop =
    (key: UploadFieldKey) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) setUpload(key, file);
    };

  const openFileDialog = (key: UploadFieldKey) => {
    const input = document.getElementById(`file-${key}`) as HTMLInputElement | null;
    input?.click();
  };

  const UploadedBadge = ({ name }: { name: string }) => (
    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
      <FileText className="h-3.5 w-3.5" />
      <span className="truncate">{name}</span>
    </div>
  );

  return (
    <Card className="py-0 relative">
      <CardContent className="py-4 px-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            {/* Header */}
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-16">
                <h1 className="font-semibold text-base text-orange">
                  Verification Methods
                </h1>
              </div>
            </AccordionTrigger>

            {/* small external icon in title area*/}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="absolute top-4.5 left-[210px] hidden md:inline-flex text-dark-gray hover:text-orange"
              aria-label="Open verification info"
              title="Open"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            <AccordionContent className="pt-4 pb-6">
              <div className="space-y-6">
                {/* Banner */}
                {bannerError && (
                  <div className="w-full rounded-lg bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-3">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-500 font-medium">
                      {bannerError}
                    </p>
                  </div>
                )}

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <FieldOrange label="Your NID Number">
                      <Input
                        value={nidNumber}
                        onChange={(e) => setNidNumber(e.target.value)}
                        placeholder="Enter your NID Number"
                        className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                      />
                    </FieldOrange>

                    <UploadBox
                      title="Front Side of NID"
                      orange
                      fileState={uploads.nidFront}
                      error={errors.nidFront}
                      onPick={() => openFileDialog("nidFront")}
                      onRemove={() => setUpload("nidFront", null)}
                      onDrop={onDrop("nidFront")}
                      onDragOver={(e) => e.preventDefault()}
                      accept={ACCEPT.imagesAndPdf}
                      inputId="file-nidFront"
                      onChange={(f) => setUpload("nidFront", f)}
                      UploadedBadge={UploadedBadge}
                    />

                    <UploadBox
                      title="Back Side of NID"
                      orange
                      fileState={uploads.nidBack}
                      error={errors.nidBack}
                      onPick={() => openFileDialog("nidBack")}
                      onRemove={() => setUpload("nidBack", null)}
                      onDrop={onDrop("nidBack")}
                      onDragOver={(e) => e.preventDefault()}
                      accept={ACCEPT.imagesAndPdf}
                      inputId="file-nidBack"
                      onChange={(f) => setUpload("nidBack", f)}
                      UploadedBadge={UploadedBadge}
                    />
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <FieldOrange label="Your Trade License Number">
                      <Input
                        value={tradeLicenseNumber}
                        onChange={(e) => setTradeLicenseNumber(e.target.value)}
                        placeholder="Enter your Trade License Number"
                        className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                      />
                    </FieldOrange>

                    <UploadBox
                      title="Upload Trade License"
                      orange
                      fileState={uploads.tradeLicense}
                      error={errors.tradeLicense}
                      onPick={() => openFileDialog("tradeLicense")}
                      onRemove={() => setUpload("tradeLicense", null)}
                      onDrop={onDrop("tradeLicense")}
                      onDragOver={(e) => e.preventDefault()}
                      accept={ACCEPT.imagesAndPdf}
                      inputId="file-tradeLicense"
                      onChange={(f) => setUpload("tradeLicense", f)}
                      UploadedBadge={UploadedBadge}
                    />
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-4">
                    <FieldOrange label="Your TIN Number">
                      <Input
                        value={tinNumber}
                        onChange={(e) => setTinNumber(e.target.value)}
                        placeholder="Enter your TIN Number"
                        className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                      />
                    </FieldOrange>

                    <UploadBox
                      title="Upload TIN Certificate"
                      orange
                      fileState={uploads.tinCertificate}
                      error={errors.tinCertificate}
                      onPick={() => openFileDialog("tinCertificate")}
                      onRemove={() => setUpload("tinCertificate", null)}
                      onDrop={onDrop("tinCertificate")}
                      onDragOver={(e) => e.preventDefault()}
                      accept={ACCEPT.imagesAndPdf}
                      inputId="file-tinCertificate"
                      onChange={(f) => setUpload("tinCertificate", f)}
                      UploadedBadge={UploadedBadge}
                    />

                    <FieldOrange label="Your BIN Number">
                      <Input
                        value={binNumber}
                        onChange={(e) => setBinNumber(e.target.value)}
                        placeholder="Enter your BIN Number"
                        className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                      />
                    </FieldOrange>
                  </div>
                </div>

                {/* Footer note (optional, keeps SS clean) */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    className="rounded-full px-8 text-xs bg-orange text-white hover:bg-orange/90"
                    onClick={() => {
                      // demo: clear banner if fields are filled
                      setBannerError(null);
                    }}
                  >
                    Save Documents
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

/* ----------------------- Small helpers ----------------------- */

function FieldOrange({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-orange">{label}</p>
      {children}
    </div>
  );
}

function UploadBox({
  title,
  orange,
  fileState,
  error,
  onPick,
  onRemove,
  onDrop,
  onDragOver,
  accept,
  inputId,
  onChange,
  UploadedBadge,
}: {
  title: string;
  orange?: boolean;
  fileState: UploadFileState;
  error?: string;
  onPick: () => void;
  onRemove: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  accept: string;
  inputId: string;
  onChange: (file: File | null) => void;
  UploadedBadge: React.FC<{ name: string }>;
}) {
  const hasFile = !!fileState.file;

  return (
    <div className="space-y-2">
      <p className={`text-xs font-semibold ${orange ? "text-orange" : ""}`}>
        {title}
      </p>

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
        {/* Hidden input */}
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
                <UploadedBadge name={fileState.file?.name ?? ""} />
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

            {fileState.previewUrl && (
              <div className="mt-3 rounded-md overflow-hidden border border-black/10">
                {/* image preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fileState.previewUrl}
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
