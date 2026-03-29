import Image from "next/image";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface Props {
  tinNumber?: string;
  tinImage?: string;
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

const BrandTinCertificateCard = ({ tinNumber, tinImage }: Props) => {
  const imageSrc = isValidImageSrc(tinImage) ? tinImage!.trim() : null;

  return (
    <CollapsibleCard heading="TIN Certificate">
      <div className="space-y-4 p-4">
        <div>
          <h3 className="text-xs text-Primary font-semibold">TIN Number</h3>
          <p className="text-light-green font-semibold text-xl mt-1">
            {tinNumber || "N/A"}
          </p>
        </div>

        <div>
          <h3 className="text-xs text-Primary font-semibold mb-2">TIN Certificate</h3>
          <div className="border rounded-md border-dashed h-[140px] w-full bg-gray-50 relative overflow-hidden">
            {imageSrc ? (
              <Image src={imageSrc} alt="TIN Certificate" fill className="object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                TIN Certificate
              </div>
            )}
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default BrandTinCertificateCard;