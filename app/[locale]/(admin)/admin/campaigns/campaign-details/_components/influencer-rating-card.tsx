import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CampaignStatusType, InvitationStatusType } from "../[id]/page";
import CollapsibleCard from "./collapsible-card";
import StarRating from "./star-rating";
import ClientRatingCard from "./client-rating-card";

interface Props {
  campaignStatus: CampaignStatusType;
  invitationStatus: InvitationStatusType;
}

const clientRatings = [
  {
    id: 1,
    name: "Hania Amir",
    avatarUrl: "https://github.com/ninjastorm24.png",
    rating: 4,
  },
  {
    id: 2,
    name: "Ali Zafar",
    avatarUrl: "https://github.com/shadcn.png",
    rating: 5,
  },
];

const InfluencerRatingCard = ({ campaignStatus, invitationStatus }: Props) => {
  return (
    <CollapsibleCard
      heading="Rating overview of the Influencers"
      badgeText={
        campaignStatus !== "needs-quote"
          ? "Campaign Has Not Finished Yet"
          : "Campaign Is Not Started Yet"
      }
    >
      {campaignStatus !== "needs-quote" ? (
        <div className="space-y-2">
          <div className="space-y-2">
            {clientRatings.map((client) => (
              <ClientRatingCard
                key={client.id}
                name={client.name}
                avatarUrl={client.avatarUrl}
                rating={client.rating}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">
            Client needs to confirm the quote first
          </p>
        </div>
      )}
    </CollapsibleCard>
  );
};

export default InfluencerRatingCard;
