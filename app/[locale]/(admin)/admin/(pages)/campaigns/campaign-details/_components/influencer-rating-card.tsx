import { useEffect, useState } from "react";
import CollapsibleCard from "./collapsible-card";
import ClientRatingCard from "./client-rating-card";
import { CampaignStatusType } from "@/types/admin/campaign/campaign_details_type";
import { getCampaignRatings } from "@/service/admin/campaign/get-campaign-ratings";

interface Props {
  campaignId: string;
  campaignType?: string;
  campaignStatus: CampaignStatusType;
  agencyIsRated?: boolean;
  agencyRating?: number;
  agencyName?: string;
  agencyAvatarUrl?: string;
}

type RatingItem = {
  id: string;
  name: string;
  avatarUrl?: string;
  rating: number;
};

const InfluencerRatingCard = ({
  campaignId,
  campaignType,
  campaignStatus,
  agencyIsRated = false,
  agencyRating = 0,
  agencyName = "Agency",
  agencyAvatarUrl,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const isInfluencerPromotion =
    String(campaignType ?? "").toLowerCase() === "influencer_promotion";

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      if (!isInfluencerPromotion || !campaignId) return;

      try {
        setLoading(true);
        const res = await getCampaignRatings(campaignId);
        const list = Array.isArray(res?.data?.influencerRatings)
          ? res.data.influencerRatings
          : [];

        if (!ignore) {
          setRatings(
            list
              .filter((x) => x?.isRated)
              .map((x) => ({
                id: String(x.influencerId),
                name: String(x.influencerName || "Influencer"),
                avatarUrl: x.influencerImage || undefined,
                rating: Number(x.rating || 0),
              }))
          );
        }
      } catch {
        if (!ignore) setRatings([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    run();

    return () => {
      ignore = true;
    };
  }, [campaignId, isInfluencerPromotion]);

  const agencyRatings: RatingItem[] =
    agencyIsRated && agencyRating > 0
      ? [
          {
            id: "agency",
            name: agencyName,
            avatarUrl: agencyAvatarUrl,
            rating: agencyRating,
          },
        ]
      : [];

  const finalRatings = isInfluencerPromotion ? ratings : agencyRatings;
  const heading = isInfluencerPromotion
    ? "Rating overview of the Influencers"
    : "Rating overview of the Agency";

  return (
    <CollapsibleCard
      heading={heading}
      badgeText={
        campaignStatus !== "needs-quote"
          ? "Campaign Has Not Finished Yet"
          : "Campaign Is Not Started Yet"
      }
    >
      {campaignStatus !== "needs-quote" ? (
        <div className="space-y-2">
          <div className="space-y-2">
            {loading ? (
              <div className="min-h-[140px] flex items-center justify-center">
                <p className="text-gray-400">Loading ratings...</p>
              </div>
            ) : finalRatings.length > 0 ? (
              finalRatings.map((client) => (
                <ClientRatingCard
                  key={client.id}
                  name={client.name}
                  avatarUrl={client.avatarUrl}
                  rating={client.rating}
                />
              ))
            ) : (
              <div className="min-h-[140px] flex items-center justify-center">
                <p className="text-gray-400">
                  {isInfluencerPromotion
                    ? "No influencer ratings yet"
                    : "Agency has not been rated yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Client needs to confirm the quote first</p>
        </div>
      )}
    </CollapsibleCard>
  );
};

export default InfluencerRatingCard;
