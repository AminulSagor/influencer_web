import React from "react";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface NidInfo {
  nidNumber: string;
  frontSideImageUrl?: string;
  backSideImageUrl?: string;
}

interface Props {
  nidInfo: NidInfo;
}
const NidInfoCard = ({ nidInfo }: Props) => {
  return (
    <CollapsibleCard heading="NID Info">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-Primary font-semibold text-lg">NID Number</h3>
          <p className="text-light-green font-semibold text-2xl">
            {nidInfo.nidNumber}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <h3 className="text-Primary font-semibold text-lg">
              Front Side Of Nid
            </h3>
            <div className="border rounded-md border-dashed h-[100px] w-full bg-gray-100"></div>
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-Primary font-semibold text-lg">
              Back Side Of Nid
            </h3>
            <div className="border rounded-md border-dashed h-[100px] w-full bg-gray-100"></div>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default NidInfoCard;
