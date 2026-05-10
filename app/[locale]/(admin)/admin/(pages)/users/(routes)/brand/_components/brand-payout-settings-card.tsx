import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

const BrandPayoutSettingsCard = () => {
  return (
    <div className="h-full [&>div]:h-full">
      <CollapsibleCard heading="Payout Settings">
      <div className="p-4 text-sm text-muted-foreground">
        No payout settings available
      </div>
      </CollapsibleCard>
    </div>
  );
};

export default BrandPayoutSettingsCard;