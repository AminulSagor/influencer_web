export type InfluencerVerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "unverified"
  | string;

export type InfluencerSocialPlatform =
  | "Instagram"
  | "Facebook"
  | "Tiktok"
  | "Youtube"
  | "X"
  | "LinkedIn"
  | string;

export type InfluencerAddress = {
  thana: string;
  zilla: string;
  country: string;
  addressName: string;
  fullAddress: string;
};

/* ✅ NEW: niche object */
export type InfluencerNicheItem = {
  niche: string;
  status: InfluencerVerificationStatus;
};

/* ✅ NEW: skill object */
export type InfluencerSkillItem = {
  skill: string;
  status: InfluencerVerificationStatus;
};

/* ✅ FIXED: backend uses profileUrl not url */
export type InfluencerSocialLink = {
  website: string | null;
  platform: InfluencerSocialPlatform;
  url: string;
};

export type InfluencerNidVerification = {
  nidStatus: InfluencerVerificationStatus;
  nidRejectReason: string;
};

export type InfluencerUserInfo = {
  id: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
  fcmToken: string | null;
  createdAt: string;
  updatedAt: string;
};

/* ✅ NEW: payouts structure from API */
export type InfluencerBankPayout = {
  bankName: string;
  accStatus: InfluencerVerificationStatus;
  bankAccNo: string;
  bankRoutingNo: string;
  bankBranchName: string;
  bankAccHolderName: string;
};

export type InfluencerMobileBankingPayout = {
  accStatus: InfluencerVerificationStatus;
  accountNo: string;
  accountType: string;
  accountHolderName: string;
};

export type InfluencerPayouts = {
  bank: InfluencerBankPayout[];
  mobileBanking: InfluencerMobileBankingPayout[];
};

export type InfluencerVerificationProfile = {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;

  /* backend sometimes uses profileImg */
  profileImage: string | null;
  profileImg: string | null;

  addresses: InfluencerAddress[];

  /* ✅ fixed arrays */
  niches: InfluencerNicheItem[] | null;
  skills: InfluencerSkillItem[] | null;

  website: string | null;

  /* ✅ fixed shape */
  socialLinks: InfluencerSocialLink[];

  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;

  nidVerification: InfluencerNidVerification;

  isOnboardingComplete: boolean;

  /* ✅ fixed payouts */
  payouts: InfluencerPayouts | null;

  averageRating: string;
  totalReviews: number;

  userId: string;
  user: InfluencerUserInfo;

  createdAt: string;
  updatedAt: string;
};

export type InfluencerVerificationProfileResponse = {
  success: boolean;
  data: InfluencerVerificationProfile;
};