import Image from "next/image";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface NidInfo {
  nidNumber?: string;
  frontSideImageUrl?: string;
  backSideImageUrl?: string;
}

interface Props {
  nidInfo?: NidInfo;
}

const isValidImageSrc = (value?: string) => {
  if (!value) return false;

  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed === "pending-upload") return false;

  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  );
};

const NidInfoCard = ({ nidInfo }: Props) => {
  const frontImageSrc = isValidImageSrc(nidInfo?.frontSideImageUrl)
    ? nidInfo?.frontSideImageUrl!.trim()
    : null;

  const backImageSrc = isValidImageSrc(nidInfo?.backSideImageUrl)
    ? nidInfo?.backSideImageUrl!.trim()
    : null;

  return (
    <CollapsibleCard heading="NID Info">
      <div className="space-y-4">
        <div className="space-y-2 px-4 pt-2">
          <h3 className="text-Primary font-semibold text-lg">NID Number</h3>
          <p className="text-light-green font-semibold text-2xl">
            {nidInfo?.nidNumber || "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-4 px-4 pb-4">
          <div className="flex-1 space-y-1">
            <h3 className="text-Primary font-semibold text-sm">
              Front Side Of NID
            </h3>
            <div className="border rounded-md border-dashed h-[140px] w-full bg-gray-50 relative overflow-hidden">
              {frontImageSrc ? (
                <Image
                  src={frontImageSrc}
                  alt="NID Front"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                  Front Side Of NID
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="text-Primary font-semibold text-sm">
              Back Side Of NID
            </h3>
            <div className="border rounded-md border-dashed h-[140px] w-full bg-gray-50 relative overflow-hidden">
              {backImageSrc ? (
                <Image
                  src={backImageSrc}
                  alt="NID Back"
                  fill
                  className="object-cover"
                />
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

export default NidInfoCard;