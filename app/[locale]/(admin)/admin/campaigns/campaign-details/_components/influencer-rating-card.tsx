import CollapsibleCard from "./collapsible-card";

const InfluencerRatingCard = () => {
  return (
    <CollapsibleCard
      heading="Rating overview of the Influencers"
      badgeText="Campaign Is Not Started Yet"
    >
      <div className="min-h-[300px] flex items-center justify-center">
        <p className="text-gray-400">Client needs to confirm the quote first</p>
      </div>
    </CollapsibleCard>
  );
};

export default InfluencerRatingCard;
