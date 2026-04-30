import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import type { AgencyCampaignAsset } from "@/types/agency/job-details";
import { BsDownload, BsFileEarmarkText } from "react-icons/bs";
import { PiImageLight, PiVideoLight } from "react-icons/pi";

interface ContentAssetCardProps {
  assets: AgencyCampaignAsset[];
}

function getAssetIcon(mimeType?: string) {
  if (mimeType?.startsWith("image/")) return <PiImageLight size={30} />;
  if (mimeType?.startsWith("video/")) return <PiVideoLight size={30} />;
  return <BsFileEarmarkText size={30} />;
}

function formatFileSize(size?: string) {
  const bytes = Number(size);

  if (!Number.isFinite(bytes) || bytes <= 0) return size || "File";
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)}MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)}KB`;

  return `${bytes}B`;
}

const ContentAssetCard = ({ assets }: ContentAssetCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-Primary flex items-center gap-2">
          <BsDownload /> Content Assets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {assets.length ? (
          assets.map((asset) => (
            <Item
              key={asset.id}
              asChild
              variant="outline"
              className="text-light-green border border-light-green bg-linear-to-r bg-white to-Secondary hover:bg-light-green/10"
            >
              <a href={asset.fileUrl} target="_blank" rel="noreferrer">
                <div>{getAssetIcon(asset.mimeType)}</div>
                <ItemContent>
                  <ItemTitle>{asset.description || asset.fileName}</ItemTitle>
                  <ItemDescription className="text-light-green text-xs">
                    {asset.assetType || asset.mimeType || "File"} - {formatFileSize(asset.fileSize)}
                  </ItemDescription>
                </ItemContent>
              </a>
            </Item>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No content assets available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentAssetCard;
