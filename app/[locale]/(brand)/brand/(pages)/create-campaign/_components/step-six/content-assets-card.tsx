"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Film, FileText, File, Album } from "lucide-react";
import type {
  Campaignservice,
  CampaignAssetservice,
} from "@/types/client/campaigns/create-campaign-types";

type Props = { campaign: Campaignservice | null };

const ContentAssetsCard = ({ campaign }: Props) => {
  const assets: CampaignAssetservice[] = Array.isArray(campaign?.assets)
    ? campaign!.assets
    : [];
  const contentAssets = assets.filter(
    (a) => (a.category || "").toLowerCase() === "content",
  );

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image")) return <Album size={20} />;
    if (fileType.startsWith("video")) return <Film size={20} />;
    if (fileType.includes("pdf")) return <FileText size={20} />;
    return <File size={20} />;
  };

  const getFileSize = (size: string | null) => {
    if (!size) return "N/A";
    const n = Number(size);
    if (Number.isNaN(n)) return "N/A";
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex gap-1.5 text-Primary font-semibold">
          <Download size={20} />
          <h2>Content Assets</h2>
          <span className="text-sm text-gray-500 font-normal ml-2">
            ({contentAssets.length} files)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-3">
          {contentAssets.length > 0 ? (
            contentAssets.map((asset, index) => {
              const name = asset.fileName || "Unnamed file";
              const mime = asset.mimeType || asset.assetType || "";
              const ext = name.split(".").pop()?.toUpperCase();

              return (
                <div
                  key={asset.id || index}
                  className="flex justify-between bg-linear-to-r from-white to-light-green/10 items-center rounded-xl py-3 px-4 text-sm border-light-green border"
                >
                  <div className="flex gap-3 items-center">
                    <span className="text-light-green">
                      {getFileIcon(mime)}
                    </span>
                    <div className="text-sm">
                      <p className="text-light-green">{name}</p>
                      <p className="text-xs text-light-green">
                        {ext} - {getFileSize(asset.fileSize)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No content assets uploaded</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAssetsCard;
