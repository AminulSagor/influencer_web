"use client";

import { useMemo, useState } from "react";
import CollapseCard from "@/app/[locale]/(brand)/brand/_components/collapse-card";
import { Download, Film, FileText, File, Album, Link2 } from "lucide-react";
import {
  CampaignAsset,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import { useTranslations } from "next-intl";

type Props = {
  campaign: ClientCampaignDetails;
};

const ITEMS_PER_PAGE = 3;

const chunkArray = <T,>(items: T[], size: number): T[][] => {
  if (!items.length) return [];
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
};

const getFileIcon = (asset: CampaignAsset) => {
  const mime = (asset.mimeType ?? asset.assetType ?? "").toLowerCase();
  const assetType = (asset.assetType ?? "").toLowerCase();

  if (
    assetType.includes("link") ||
    mime.includes("link") ||
    mime.includes("url")
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

function AssetSliderSection({
  title,
  assets,
}: {
  title: string;
  assets: CampaignAsset[];
}) {
  const t = useTranslations("brand.CampaignDetailsPage");
  const pages = useMemo(() => chunkArray(assets, ITEMS_PER_PAGE), [assets]);
  const [pageIndex, setPageIndex] = useState(0);

  const safePageIndex =
    pages.length === 0 ? 0 : Math.min(pageIndex, Math.max(pages.length - 1, 0));

  const currentPage = pages[safePageIndex] ?? [];

  return (
    <CollapseCard title={title} icon={<Download size={20} />}>
      {!assets.length ? (
        <p className="text-sm text-black/50">
          {t("assetsCard.noAssetsUploaded")}
        </p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {currentPage.map((asset) => {
              const ext = asset.fileName?.split(".").pop()?.toUpperCase();
              const sizeLabel = getFileSize(asset.fileSize);
              const meta = [ext, sizeLabel].filter(Boolean).join(" - ");

              return (
                <a
                  key={asset.id}
                  href={asset.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-light-green bg-linear-to-r from-white to-light-green/30 px-4 py-3 text-sm transition hover:bg-light-green/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-light-green">
                      {getFileIcon(asset)}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-light-green">
                        {asset.fileName || t("assetsCard.untitledAsset")}
                      </p>
                      <p className="text-xs text-light-green/80">
                        {meta || asset.assetType || t("assetsCard.file")}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-light-green">
                    <Download size={20} />
                  </span>
                </a>
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
    </CollapseCard>
  );
}

export default function AssetsCard({ campaign }: Props) {
  const t = useTranslations("brand.CampaignDetailsPage");

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
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <AssetSliderSection
        title={t("assetsCard.contentAssets")}
        assets={contentAssets}
      />
      <AssetSliderSection
        title={t("assetsCard.brandAssets")}
        assets={brandAssets}
      />
    </div>
  );
}
