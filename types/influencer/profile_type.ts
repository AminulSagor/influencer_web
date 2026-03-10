export interface InfluencerProfilePayload {
  // Add specific payload fields if needed
  // For GET requests, this might be query parameters
}

export interface Address {
  thana: string;
  zilla: string;
  country: string;
  addressName: string;
  fullAddress: string;
}

export interface SocialLink {
  url: string;
  platform: string;
}

export interface BankAccount {
  bankName: string;
  accStatus: "pending" | "verified" | "rejected";
  bankAccNo: string;
  bankRoutingNo: string;
  bankBranchName: string;
  bankAccHolderName: string;
}

export interface MobileBankingAccount {
  accountNo: string;
  accountHolderName: string;
  accountType: string;
  accStatus: "pending" | "verified" | "rejected";
}

export interface Payouts {
  bank: BankAccount[];
  mobileBanking: MobileBankingAccount[];
}

export interface NidVerification {
  nidStatus: "pending" | "verified" | "rejected";
  nidRejectReason: string;
}

export interface InfluencerProfileData {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  addresses: Address[];
  niches: string[] | null;
  skills: string[] | null;
  website: string | null;
  socialLinks: SocialLink[];
  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;
  nidVerification: NidVerification | null;
  profileImg: string | null;
  isOnboardingComplete: boolean;
  payouts: Payouts | null;
  averageRating: string;
  totalReviews: number;
  isEmailVerified: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InfluencerProfileResponse {
  data: InfluencerProfileData;
  message: string;
}
