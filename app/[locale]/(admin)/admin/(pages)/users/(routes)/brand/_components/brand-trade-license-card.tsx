import Image from "next/image";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface Props {
  tradeLicenseNumber?: string;
  tradeLicenseImage?: string;
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

const BrandTradeLicenseCard = ({
  tradeLicenseNumber,
  tradeLicenseImage,
}: Props) => {
  const imageSrc = isValidImageSrc(tradeLicenseImage)
    ? tradeLicenseImage!.trim()
    : null;

  return (
    <div className="h-full [&>div]:h-full">
      <CollapsibleCard heading="Trade License">
      <div className="space-y-4 p-4">
        <div>
          <h3 className="text-xs text-Primary font-semibold">Trade License Number</h3>
          <p className="text-light-green font-semibold text-xl mt-1">
            {tradeLicenseNumber || "N/A"}
          </p>
        </div>

        <div>
          <h3 className="text-xs text-Primary font-semibold mb-2">Trade License</h3>
          <div className="border rounded-md border-dashed h-[140px] w-full bg-gray-50 relative overflow-hidden">
            {imageSrc ? (
              <Image src={imageSrc} alt="Trade License" fill className="object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                Trade License
              </div>
            )}
          </div>
        </div>
      </div>
      </CollapsibleCard>
    </div>
  );
};

export default BrandTradeLicenseCard;