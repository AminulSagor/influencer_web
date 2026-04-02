"use client";

import React from "react";
import Image from "next/image";
import { FileText, UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notifyError } from "@/utils/toast_util";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

type TradeLicenseUploadProps = {
  value?: string;
  disabled?: boolean;
  onChange: (file: File | null) => void;
  onRemove: () => void;
};

const isPdfUrl = (url?: string) => {
  if (!url) return false;
  return url.toLowerCase().includes(".pdf");
};

const TradeLicenseUpload = ({
  value,
  disabled = false,
  onChange,
  onRemove,
}: TradeLicenseUploadProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(value ?? null);

  React.useEffect(() => {
    if (!file) {
      setPreview(value ?? null);
    }
  }, [value, file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      notifyError("Only PNG, JPEG, or PDF files are allowed");
      e.target.value = "";
      return;
    }

    if (selected.size > MAX_SIZE) {
      notifyError("File size must be under 2MB");
      e.target.value = "";
      return;
    }

    setFile(selected);
    onChange(selected);

    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    onRemove();
  };

  const showPdfCard =
    file?.type === "application/pdf" || (!file && isPdfUrl(value));

  return (
    <div className="space-y-2">
      <Label className="text-orange">Upload Trade License</Label>

      <div className="relative group">
        <label
          htmlFor="trade-license-upload"
          className={`flex h-44 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition ${disabled
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer hover:bg-gray-100"
            }`}
        >
          {preview && !showPdfCard ? (
            <Image
              src={preview}
              alt="Trade License Preview"
              fill
              className="rounded-lg object-cover"
            />
          ) : showPdfCard ? (
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <FileText size={32} />
              <p className="max-w-[90%] truncate text-sm">
                {file?.name ?? "Existing PDF uploaded"}
              </p>
            </div>
          ) : (
            <>
              <UploadCloud className="text-gray-400" size={32} />
              <p className="text-sm font-medium text-gray-600">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPEG, PDF (Max 2MB)</p>
            </>
          )}
        </label>

        {(file || preview || value) && !disabled && (
          <button
            type="button"
            onClick={removeFile}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Input
        id="trade-license-upload"
        type="file"
        accept="image/png,image/jpeg,application/pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};

export default TradeLicenseUpload;