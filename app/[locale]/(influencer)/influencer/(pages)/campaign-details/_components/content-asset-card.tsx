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

const ContentAssetCard = () => {
  const t = useTranslations("influencer.campaign-details")
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-Primary flex items-center gap-2">
          <BsDownload /> {t("Content Assets")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Item
          variant="outline"
          className="text-light-green border border-light-green bg-linear-to-r bg-white to-Secondary"
        >
          <div>
            <PiImageLight size={30} />
          </div>
          <ItemContent>
            <ItemTitle>Brand Logo Pack</ItemTitle>
            <ItemDescription className="text-light-green text-xs">
              PNG, SVG - 2.4MB
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
        <Item
          variant="outline"
          className="text-light-green border border-light-green bg-linear-to-r bg-white to-Secondary"
        >
          <div>
            <PiVideoLight size={30} />
          </div>
          <ItemContent>
            <ItemTitle>Product Demo Video</ItemTitle>
            <ItemDescription className="text-light-green text-xs">
              MP4 - 90MB
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
        <Item
          variant="outline"
          className="text-light-green border border-light-green bg-linear-to-r bg-white to-Secondary"
        >
          <div>
            <BsFileEarmarkText size={30} />
          </div>
          <ItemContent>
            <ItemTitle>Brand Guideline</ItemTitle>
            <ItemDescription className="text-light-green text-xs">
              PDF - 750KB
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
      </CardContent>
    </Card>
  );
};

export default ContentAssetCard;
