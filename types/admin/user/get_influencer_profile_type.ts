export type InfluencerProfileApiResponse = {
  success: boolean;
  data: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    addresses:
      | {
          thana: string | null;
          zilla: string | null;
          country: string | null;
          addressName: string | null;
          fullAddress: string | null;
        }[]
      | null;
    niches:
      | {
          niche: string | null;
          status: string | null;
        }[]
      | null;
    skills:
      | {
          skill: string | null;
          status: string | null;
        }[]
      | null;
    website: string | null;
    socialLinks:
      | {
          url: string | null;
          platform: string | null;
        }[]
      | null;
    nidNumber: string | null;
    nidFrontImg: string | null;
    nidBackImg: string | null;
    nidVerification: {
      nidStatus?: string | null;
      nidRejectReason?: string | null;
    } | null;
    profileImg: string | null;
    isOnboardingComplete: boolean;
    payouts: {
      bank:
        | {
            bankName: string | null;
            accStatus: string | null;
            bankAccNo: string | null;
            bankRoutingNo: string | null;
            bankBranchName: string | null;
            bankAccHolderName: string | null;
          }[]
        | null;
      mobileBanking:
        | {
            accStatus: string | null;
            accountNo: string | null;
            accountType: string | null;
            accountHolderName: string | null;
          }[]
        | null;
    } | null;
    averageRating: string | null;
    totalReviews: number;
    userId: string;
    user: {
      id: string;
      email: string | null;
      phone: string | null;
      role: string;
      isVerified: boolean;
      isPhoneVerified: boolean;
      isEmailVerified: boolean;
      isBlocked: boolean;
    } | null;
    createdAt: string;
    updatedAt: string;
  };
};