import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface Props {
  binNumber?: string;
}

const BrandBinCard = ({ binNumber }: Props) => {
  return (
    <div className="h-full [&>div]:h-full">
      <CollapsibleCard heading="BIN">
      <div className="flex min-h-[228px] flex-col justify-start space-y-4 p-4">
        <div>
          <h3 className="text-xs text-Primary font-semibold">BIN Number</h3>
          <p className="text-light-green font-semibold text-xl mt-1">
            {binNumber || "N/A"}
          </p>
        </div>
      </div>
      </CollapsibleCard>
    </div>
  );
};

export default BrandBinCard;