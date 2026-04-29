"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";

type AssetFileUploadValues = {
  assetName: string;
  file: File;
};

type AssetFileUploadDialogProps = {
  open: boolean;
  loading?: boolean;
  title?: string;
  accept?: string;
  onClose: () => void;
  onSubmit: (values: AssetFileUploadValues) => void | Promise<void>;
};

export default function AssetFileUploadDialog({
  open,
  loading = false,
  title = "Upload Another Asset",
  accept = "image/*,video/*,.pdf,.doc,.docx",
  onClose,
  onSubmit,
}: AssetFileUploadDialogProps) {
  const [assetName, setAssetName] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      setAssetName("");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [open]);

  if (!open) return null;

  const normalizedAssetName = assetName.trim();
  const canSubmit = Boolean(normalizedAssetName && file && !loading);

  const handleSubmit = async () => {
    if (!canSubmit || !file) return;

    await onSubmit({
      assetName: normalizedAssetName,
      file,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-sm rounded-xl border border-light-gray bg-white p-4 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-Primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-light-green transition hover:text-Primary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close asset upload dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <Input
            value={assetName}
            onChange={(event) => setAssetName(event.target.value)}
            placeholder="Asset name (e.g. Brand Logo Pack)"
            disabled={loading}
            className="h-11 rounded-xl border-light-gray focus-visible:ring-1 focus-visible:ring-light-green"
          />

          <input
            ref={inputRef}
            type="file"
            hidden
            accept={accept}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-light-gray bg-[#F8F8F8] text-sm font-medium text-Primary transition hover:bg-light-green/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={16} />
            Choose File
          </button>

          <div className="flex min-h-11 items-center rounded-xl border border-light-gray bg-[#F8F8F8] px-3 text-sm text-black/50">
            <span className="truncate">
              {file ? file.name : "No file selected yet."}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SecondaryButton
            onClick={onClose}
            disabled={loading}
            className="h-10 rounded-lg border-light-gray px-4 py-2 text-black"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-10 rounded-lg px-4 py-2"
          >
            {loading ? "Uploading..." : "Done"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
