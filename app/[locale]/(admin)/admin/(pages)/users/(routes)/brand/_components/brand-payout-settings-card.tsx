import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

const BrandPayoutSettingsCard = () => {
  return (
    <CollapsibleCard heading="Payout Settings">
      <div className="p-4 text-sm text-muted-foreground">
        No payout settings available
      </div>
    </CollapsibleCard>
  );
};

export default BrandPayoutSettingsCard;