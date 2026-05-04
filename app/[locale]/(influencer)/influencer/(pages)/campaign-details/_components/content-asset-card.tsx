"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useTranslations } from "next-intl";
import { BsDownload, BsFileEarmarkText } from "react-icons/bs";
import { PiImageLight, PiVideoLight } from "react-icons/pi";
import { CampaignAsset } from "@/types/influencer/job_types";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 3;

function getAssetIcon(mimeType: string) {
  if (mimeType?.startsWith("image/")) return <PiImageLight size={30} />;
  if (mimeType?.startsWith("video/")) return <PiVideoLight size={30} />;
  return <BsFileEarmarkText size={30} />;
}

function formatFileSize(sizeStr: string) {
  const bytes = parseInt(sizeStr, 10);
  if (isNaN(bytes)) return sizeStr;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)}MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${bytes}B`;
}

interface ContentAssetCardProps {
  assets: CampaignAsset[];
}

const ContentAssetCard = ({ assets }: ContentAssetCardProps) => {
  const t = useTranslations("influencer.campaign-details");
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(assets.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleAssets = useMemo(
    () =>
      assets.slice(
        currentPage * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      ),
    [assets, currentPage]
  );

  return (
    <Card className="h-full gap-0 py-0">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-Primary flex items-center gap-2">
          <BsDownload /> {t("Content Assets")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-6 pt-0">
        {assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assets available</p>
        ) : (
          <>
            {visibleAssets.map((asset) => (
              <Item
                key={asset.id}
                variant="outline"
                className="min-h-[88px] text-light-green border border-light-green bg-linear-to-r bg-white to-Secondary"
              >
                <div>{getAssetIcon(asset.mimeType)}</div>
                <ItemContent>
                  <ItemTitle>{asset.description || asset.fileName}</ItemTitle>
                  <ItemDescription className="text-light-green text-xs">
                    {asset.assetType} - {formatFileSize(asset.fileSize)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:text-light-green/90 border border-light-green"
                    asChild
                  >
                    <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer">
                      <BsDownload />
                    </a>
                  </Button>
                </ItemActions>
              </Item>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show content asset page ${index + 1}`}
                    onClick={() => setPage(index)}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all",
                      index === currentPage
                        ? "w-5 bg-light-green"
                        : "bg-light-green/30 hover:bg-light-green/60"
                    )}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentAssetCard;
