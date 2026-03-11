import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface Props {
  binNumber?: string;
}

const BrandBinCard = ({ binNumber }: Props) => {
  return (
    <CollapsibleCard heading="BIN">
      <div className="space-y-4 p-4">
        <div>
          <h3 className="text-xs text-Primary font-semibold">BIN Number</h3>
          <p className="text-light-green font-semibold text-xl mt-1">
            {binNumber || "N/A"}
          </p>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default BrandBinCard;