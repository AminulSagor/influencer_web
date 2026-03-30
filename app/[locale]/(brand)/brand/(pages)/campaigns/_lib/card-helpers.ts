export const formatBDT = (amount: number) =>
  `৳${amount.toLocaleString("en-US")}`;

export const getAssignedUserBasedText = (
  isAssigned: boolean,
  campaignType: "influencer_promotion" | "paid_ad",
) => {
  const isPaid = campaignType === "paid_ad";
  const isInfluencerPromotion = campaignType === "influencer_promotion";

  if (isPaid) {
    return !isAssigned && "No agency assigned";
  }
  if (isInfluencerPromotion) {
    return !isAssigned && "No influencer assigned";
  }
  return "";
};
