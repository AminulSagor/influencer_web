import Image from "next/image";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface Props {
  nidNumber?: string;
  frontImage?: string;
  backImage?: string;
}

const isValidImageSrc = (value?: string) => {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "pending-upload") return false;
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  );
};

const BrandNidInfoCard = ({ nidNumber, frontImage, backImage }: Props) => {
  const frontSrc = isValidImageSrc(frontImage) ? frontImage!.trim() : null;
  const backSrc = isValidImageSrc(backImage) ? backImage!.trim() : null;

  return (
    <CollapsibleCard heading="NID Info">
      <div className="space-y-4">
        <div className="space-y-2 px-4 pt-2">
          <h3 className="text-Primary font-semibold text-sm">NID Number</h3>
          <p className="text-light-green font-semibold text-xl">
            {nidNumber || "N/A"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4 pb-4">
          <div className="space-y-1">
            <h3 className="text-Primary font-semibold text-xs">Front Side Of NID</h3>
            <div className="border rounded-md border-dashed h-[140px] w-full bg-gray-50 relative overflow-hidden">
              {frontSrc ? (
                <Image src={frontSrc} alt="NID Front" fill className="object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                  Front Side Of NID
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-Primary font-semibold text-xs">Back Side Of NID</h3>
            <div className="border rounded-md border-dashed h-[140px] w-full bg-gray-50 relative overflow-hidden">
              {backSrc ? (
                <Image src={backSrc} alt="NID Back" fill className="object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                  Back Side Of NID
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default BrandNidInfoCard;