"use client";

import CollapseCard from "@/app/[locale]/(brand)/brand/_components/collapse-card";
import { Download, Film, FileText, File, Album, Link2 } from "lucide-react";
import React from "react";
import type { Campaignservice, CampaignAssetservice } from "@/app/[locale]/(brand)/brand/types/client-types";

type Props = {
  campaign: Campaignservice;
};

const getFileIcon = (asset: CampaignAssetservice) => {
  const mime = (asset.mimeType ?? asset.assetType ?? "").toLowerCase();
  if (mime.includes("http") || asset.fileUrl?.startsWith("http")) {
    // link types also use fileUrl - but keep normal icon if mime matches
  }
  if (mime.startsWith("image")) return <Album size={20} />;
  if (mime.startsWith("video")) return <Film size={20} />;
  if (mime.includes("pdf")) return <FileText size={20} />;
  if (asset.assetType?.toLowerCase().includes("link")) return <Link2 size={20} />;
  return <File size={20} />;
};

const getFileSize = (sizeStr: string | null) => {
  const size = Number(sizeStr ?? 0);
  if (!Number.isFinite(size) || size <= 0) return null;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

function AssetList({ assets }: { assets: CampaignAssetservice[] }) {
  if (!assets.length) {
    return <p className="text-sm text-black/50">No assets uploaded.</p>;
  }

  return (
    <div className="space-y-3">
      {assets.map((asset) => {
        const ext = asset.fileName?.split(".").pop()?.toUpperCase();
        const sizeLabel = getFileSize(asset.fileSize);
        const meta = [ext, sizeLabel].filter(Boolean).join(" - ");

        return (
          <a
            key={asset.id}
            href={asset.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex justify-between bg-linear-to-r from-white to-light-green/30 items-center rounded-xl py-3 px-4 text-sm border-light-green border hover:bg-light-green/20 transition"
          >
            <div className="flex gap-3 items-center">
              <span className="text-light-green">{getFileIcon(asset)}</span>
              <div className="text-sm">
                <p className="text-light-green">{asset.fileName}</p>
                <p className="text-xs text-light-green">{meta || asset.assetType}</p>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default function AssetsCard({ campaign }: Props) {
  const contentAssets = (campaign.assets ?? []).filter((a) => a.category === "content");
  const brandAssets = (campaign.assets ?? []).filter((a) => a.category === "brand");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <CollapseCard title="Content Assets" icon={<Download size={20} />}>
        <AssetList assets={contentAssets} />
      </CollapseCard>

      <CollapseCard title="Brand Assets" icon={<Download size={20} />}>
        <AssetList assets={brandAssets} />
      </CollapseCard>
    </div>
  );
}
