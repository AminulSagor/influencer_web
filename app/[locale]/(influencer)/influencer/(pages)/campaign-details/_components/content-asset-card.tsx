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
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-Primary flex items-center gap-2">
          <BsDownload /> {t("Content Assets")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No assets available</p>
        ) : (
          assets.map((asset) => (
            <Item
              key={asset.id}
              variant="outline"
              className="text-light-green border border-light-green bg-linear-to-r bg-white to-Secondary"
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
                  <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" download>
                    <BsDownload />
                  </a>
                </Button>
              </ItemActions>
            </Item>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ContentAssetCard;
