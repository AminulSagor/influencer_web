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

/* ---------------- icon map ---------------- */
const fileTypeIconMap: Record<string, ReactNode> = {
  image: <PiImageLight size={30} />,
  video: <PiVideoLight size={30} />,
  document: <BsFileEarmarkText size={30} />,
};

/* ---------------- data ---------------- */
const contentAssets = [
  {
    id: 1,
    title: "Brand Logo Pack",
    meta: "PNG, SVG - 2.4MB",
    type: "image",
  },
  {
    id: 2,
    title: "Product Demo Video",
    meta: "MP4 - 90MB",
    type: "video",
  },
  {
    id: 3,
    title: "Brand Guideline",
    meta: "PDF - 750KB",
    type: "document",
  },
];

const ContentAssetCard = () => {
  return (
    <CollapsibleCard heading="Content Assets" icon={<BsDownload />}>
      <div className="space-y-2">
        {contentAssets.map((asset) => (
          <Item
            key={asset.id}
            variant="outline"
            className="text-light-green border border-light-green bg-linear-to-r bg-white to-Secondary"
          >
            <div>{fileTypeIconMap[asset.type]}</div>
            <ItemContent>
              <ItemTitle>{asset.title}</ItemTitle>
              <ItemDescription className="text-light-green text-xs">
                {asset.meta}
              </ItemDescription>
            </ItemContent>

            <ItemActions>
              <Button
                variant="outline"
                size="sm"
                className="hover:text-light-green/90 border border-light-green"
              >
                <BsDownload />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </CollapsibleCard>
  );
};

export default ContentAssetCard;
