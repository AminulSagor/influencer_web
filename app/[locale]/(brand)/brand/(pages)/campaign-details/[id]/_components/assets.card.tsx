"use client";

import * as React from "react";
import CollapseCard from "@/app/[locale]/(brand)/brand/_components/collapse-card";
import DottedButton from "@/app/[locale]/(brand)/brand/_components/dotted-button";
import BrandAssetLinkDialog from "@/app/[locale]/(brand)/brand/_components/brand-asset-link-dialog";
import AssetFileUploadDialog from "@/app/[locale]/(brand)/brand/_components/asset-file-upload-dialog";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { Download, Film, FileText, File, Album, Link2, Trash2, X } from "lucide-react";
import {
  CampaignAsset,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import { useTranslations } from "next-intl";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import { getSignedUrl } from "@/service/client/upload/get-signed-url";
import { uploadFileToS3 } from "@/service/client/upload/upload-file-to-s3";
import { uploadCampaignAssets } from "@/service/campaign/upload-campaign-assets";
import { deleteCampaignAsset } from "@/service/campaign/delete-campaign-asset";
import { useCampaignDetails } from "./campaign-details-provider";

type Props = {
  campaign: ClientCampaignDetails;
};

type AssetSectionCategory = "content" | "brand";

const ITEMS_PER_PAGE = 3;
const UPLOAD_MODULE = "brandguru/client/campaign-assets";

const chunkArray = <T,>(items: T[], size: number): T[][] => {
  if (!items.length) return [];
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
};

const getAssetDisplayName = (asset: CampaignAsset, fallback: string) => {
  const description = asset.description?.trim();
  const fileName = asset.fileName?.trim();

  return description || fileName || fallback;
};

const getFileIcon = (asset: CampaignAsset) => {
  const mime = (asset.mimeType ?? asset.assetType ?? "").toLowerCase();
  const assetType = (asset.assetType ?? "").toLowerCase();

  if (
    assetType.includes("link") ||
    assetType.includes("brand_asset") ||
    mime.includes("link") ||
    mime.includes("url") ||
    mime.includes("text/plain")
  ) {
    return <Link2 size={20} />;
  }

  if (mime.startsWith("image")) return <Album size={20} />;
  if (mime.startsWith("video")) return <Film size={20} />;
  if (mime.includes("pdf")) return <FileText size={20} />;

  return <File size={20} />;
};

const getFileSize = (sizeStr: string | null) => {
  const size = Number(sizeStr ?? 0);

  if (!Number.isFinite(size) || size <= 0) return null;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

const uploadFileToServer = async (file: File): Promise<string> => {
  const signedUrlResult = await getSignedUrl({
    fileName: file.name,
    fileType: file.type || "application/octet-stream",
    module: UPLOAD_MODULE,
  });

  if (typeof signedUrlResult === "string") {
    throw new Error(signedUrlResult);
  }

  const uploadResult = await uploadFileToS3(signedUrlResult.signedUrl, file);

  if (uploadResult !== true) {
    throw new Error(uploadResult);
  }

  return signedUrlResult.publicUrl;
};

function DeleteAssetDialog({
  assetName,
  loading,
  onClose,
  onConfirm,
}: {
  assetName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-sm rounded-xl border border-red-200 bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
              <Trash2 size={18} />
            </span>
            <h2 className="text-base font-semibold">Delete Asset</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close delete asset dialog"
          >
            <X size={18} />
          </button>
        </div>

        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-600">
          Are you sure you want to delete {assetName || "this asset"}? This action cannot be undone.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SecondaryButton
            onClick={onClose}
            disabled={loading}
            className="h-10 rounded-lg border-red-100 px-4 py-2 text-red-600"
          >
            Cancel
          </SecondaryButton>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-10 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AssetSliderSection({
  title,
  assets,
  category,
  campaignId,
  onUploaded,
}: {
  title: string;
  assets: CampaignAsset[];
  category: AssetSectionCategory;
  campaignId: string;
  onUploaded: () => Promise<void>;
}) {
  const t = useTranslations("brand.CampaignDetailsPage");
  const pages = React.useMemo(() => chunkArray(assets, ITEMS_PER_PAGE), [assets]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [brandDialogOpen, setBrandDialogOpen] = React.useState(false);
  const [fileDialogOpen, setFileDialogOpen] = React.useState(false);
  const [assetToDelete, setAssetToDelete] = React.useState<CampaignAsset | null>(null);

  React.useEffect(() => {
    setPageIndex(0);
  }, [assets.length]);

  const safePageIndex =
    pages.length === 0 ? 0 : Math.min(pageIndex, Math.max(pages.length - 1, 0));

  const currentPage = pages[safePageIndex] ?? [];
  const uploadButtonLabel = assets.length
    ? category === "brand"
      ? "Upload Another Brand Asset"
      : "Upload Another Asset"
    : "Upload Asset";

  const handleUploadClick = () => {
    if (category === "brand") {
      setBrandDialogOpen(true);
      return;
    }

    setFileDialogOpen(true);
  };

  const handleContentUpload = async ({
    assetName,
    file,
  }: {
    assetName: string;
    file: File;
  }) => {
    setUploading(true);

    try {
      const fileUrl = await uploadFileToServer(file);

      const response = await uploadCampaignAssets(campaignId, {
        assets: [
          {
            fileName: file.name,
            fileUrl,
            assetType: file.type || "application/octet-stream",
            category,
            fileSize: file.size,
            mimeType: file.type || "application/octet-stream",
            description: assetName,
          },
        ],
      });

      if (!response.success) {
        notifyError(response.message || "Failed to upload asset");
        return;
      }

      notifySuccess(response.message || "Asset uploaded successfully");
      setFileDialogOpen(false);
      await onUploaded();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || "Failed to upload asset";
      notifyError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleBrandAssetSubmit = async ({
    assetName,
    pageLink,
  }: {
    assetName: string;
    pageLink: string;
  }) => {
    setUploading(true);

    try {
      const response = await uploadCampaignAssets(campaignId, {
        assets: [
          {
            fileName: assetName,
            fileUrl: pageLink,
            assetType: "brand_asset",
            category,
            mimeType: "text/plain",
            description: assetName,
          },
        ],
      });

      if (!response.success) {
        notifyError(response.message || "Failed to upload brand asset");
        return;
      }

      notifySuccess(response.message || "Brand asset uploaded successfully");
      setBrandDialogOpen(false);
      await onUploaded();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message ||
            "Failed to upload brand asset";
      notifyError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAsset = async () => {
    if (!assetToDelete) return;

    setDeleting(true);

    try {
      const response = await deleteCampaignAsset(assetToDelete.id);

      if (!response.success) {
        notifyError(response.message || "Failed to delete asset");
        return;
      }

      notifySuccess(response.message || "Asset deleted successfully");
      setAssetToDelete(null);
      await onUploaded();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || "Failed to delete asset";
      notifyError(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <CollapseCard title={title} icon={<Download size={20} />}>
      <div className="space-y-4">
        {!assets.length ? (
          <p className="text-sm text-black/50">
            {t("assetsCard.noAssetsUploaded")}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {currentPage.map((asset) => {
                const displayName = getAssetDisplayName(
                  asset,
                  t("assetsCard.untitledAsset"),
                );
                const ext = asset.fileName?.split(".").pop()?.toUpperCase();
                const sizeLabel = getFileSize(asset.fileSize);
                const meta = category === "brand"
                  ? asset.fileUrl
                  : [ext, sizeLabel].filter(Boolean).join(" - ");

                return (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-light-green bg-linear-to-r from-white to-light-green/30 px-4 py-3 text-sm transition hover:bg-light-green/20"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="shrink-0 text-light-green">
                        {getFileIcon(asset)}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-light-green">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-light-green/80">
                          {meta || asset.assetType || t("assetsCard.file")}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-light-green">
                      <a
                        href={asset.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="transition hover:text-Primary"
                        aria-label={`Download ${displayName}`}
                      >
                        <Download size={20} />
                      </a>
                      <button
                        type="button"
                        onClick={() => setAssetToDelete(asset)}
                        disabled={deleting || uploading}
                        className="transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Delete ${displayName}`}
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {pages.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-1">
                {pages.map((_, index) => {
                  const isActive = index === safePageIndex;

                  return (
                    <button
                      key={index}
                      type="button"
                      aria-label={t("assetsCard.goToPage", { page: index + 1 })}
                      onClick={() => setPageIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        isActive ? "bg-light-green" : "bg-black/15"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        <DottedButton onClick={handleUploadClick} disabled={uploading || deleting}>
          {uploading ? "Uploading..." : uploadButtonLabel}
        </DottedButton>
      </div>

      <AssetFileUploadDialog
        open={fileDialogOpen}
        loading={uploading}
        onClose={() => setFileDialogOpen(false)}
        onSubmit={handleContentUpload}
      />

      <BrandAssetLinkDialog
        open={brandDialogOpen}
        loading={uploading}
        onClose={() => setBrandDialogOpen(false)}
        onSubmit={handleBrandAssetSubmit}
      />

      {assetToDelete ? (
        <DeleteAssetDialog
          assetName={getAssetDisplayName(
            assetToDelete,
            t("assetsCard.untitledAsset"),
          )}
          loading={deleting}
          onClose={() => setAssetToDelete(null)}
          onConfirm={handleDeleteAsset}
        />
      ) : null}
    </CollapseCard>
  );
}

export default function AssetsCard({ campaign }: Props) {
  const t = useTranslations("brand.CampaignDetailsPage");
  const { refreshCampaign } = useCampaignDetails();

  const contentAssets = (campaign.assets ?? []).filter(
    (asset) => asset.category === "content",
  );

  const brandAssets = (campaign.assets ?? []).filter(
    (asset) => asset.category === "brand",
  );

  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  if (isInfluencerPromotion) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <AssetSliderSection
          title={t("assetsCard.contentAssets")}
          assets={contentAssets}
          category="content"
          campaignId={campaign.id}
          onUploaded={refreshCampaign}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <AssetSliderSection
        title={t("assetsCard.contentAssets")}
        assets={contentAssets}
        category="content"
        campaignId={campaign.id}
        onUploaded={refreshCampaign}
      />
      <AssetSliderSection
        title={t("assetsCard.brandAssets")}
        assets={brandAssets}
        category="brand"
        campaignId={campaign.id}
        onUploaded={refreshCampaign}
      />
    </div>
  );
}
