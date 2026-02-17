import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ReactNode } from "react";
import { BsDownload, BsFileEarmarkText } from "react-icons/bs";
import { PiImageLight, PiVideoLight } from "react-icons/pi";
import CollapsibleCard from "./collapsible-card";

const fileTypeIconMap: Record<string, ReactNode> = {
  image: <PiImageLight size={30} />,
  video: <PiVideoLight size={30} />,
  document: <BsFileEarmarkText size={30} />,
};

type Asset = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  mimeType?: string;
  description?: string;
};

const getType = (mime?: string) => {
  if (!mime) return "document";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "document";
};

export default function ContentAssetCard({ assets }: { assets: Asset[] }) {
  return (
    <CollapsibleCard heading="Content Assets" icon={<BsDownload />}>
      <div className="space-y-2">
        {assets?.length ? (
          assets.map((asset) => {
            const type = getType(asset.mimeType);
            const meta = `${asset.mimeType ?? "file"}${
              asset.fileSize ? ` - ${asset.fileSize}` : ""
            }`;

            return (
              <Item
                key={asset.id}
                variant="outline"
                className="text-light-green border border-light-green bg-linear-to-r bg-white to-Secondary"
              >
                <div>{fileTypeIconMap[type]}</div>

                <ItemContent>
                  <ItemTitle>{asset.fileName}</ItemTitle>
                  <ItemDescription className="text-light-green text-xs">
                    {asset.description ? `${asset.description} • ${meta}` : meta}
                  </ItemDescription>
                </ItemContent>

                <ItemActions>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hover:text-light-green/90 border border-light-green"
                  >
                    <a href={asset.fileUrl} target="_blank" rel="noreferrer">
                      <BsDownload />
                    </a>
                  </Button>
                </ItemActions>
              </Item>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm">No assets found.</p>
        )}
      </div>
    </CollapsibleCard>
  );
}