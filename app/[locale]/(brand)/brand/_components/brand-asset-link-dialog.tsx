"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";

type BrandAssetLinkValues = {
  assetName: string;
  pageLink: string;
};

type BrandAssetLinkDialogProps = {
  open: boolean;
  loading?: boolean;
  title?: string;
  onClose: () => void;
  onSubmit: (values: BrandAssetLinkValues) => void | Promise<void>;
};

export default function BrandAssetLinkDialog({
  open,
  loading = false,
  title = "Upload Another Brand Asset",
  onClose,
  onSubmit,
}: BrandAssetLinkDialogProps) {
  const [assetName, setAssetName] = React.useState("");
  const [pageLink, setPageLink] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setAssetName("");
      setPageLink("");
    }
  }, [open]);

  if (!open) return null;

  const normalizedAssetName = assetName.trim();
  const normalizedPageLink = pageLink.trim();
  const canSubmit = Boolean(normalizedAssetName && normalizedPageLink && !loading);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    await onSubmit({
      assetName: normalizedAssetName,
      pageLink: normalizedPageLink,
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
            aria-label="Close brand asset dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <Input
            value={assetName}
            onChange={(event) => setAssetName(event.target.value)}
            placeholder="Asset name (e.g. Facebook Page)"
            disabled={loading}
            className="h-11 rounded-xl border-light-gray focus-visible:ring-1 focus-visible:ring-light-green"
          />

          <Input
            value={pageLink}
            onChange={(event) => setPageLink(event.target.value)}
            placeholder="Page Link"
            disabled={loading}
            className="h-11 rounded-xl border-light-gray focus-visible:ring-1 focus-visible:ring-light-green"
          />
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
            {loading ? "Saving..." : "Done"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
