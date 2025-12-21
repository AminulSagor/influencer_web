import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { BsDownload, BsFileEarmarkText } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { PiImageLight, PiVideoLight } from "react-icons/pi";

const BrandAssetCard = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-Primary flex items-center gap-2">
          <BsDownload /> Brand Assets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Item
          variant="outline"
          className="text-light-green border border-light-green bg-linear-to-r bg-white to-Secondary"
        >
          <div>
            <FaFacebook size={30} />
          </div>
          <ItemContent>
            <ItemTitle>Facebook Page</ItemTitle>
            <ItemDescription className="text-light-green text-xs">
              Page Link
            </ItemDescription>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
};

export default BrandAssetCard;
