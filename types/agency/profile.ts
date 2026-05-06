export type VerificationStatus = "pending" | "approved" | "rejected";

export type AgencyNiche = {
  niche: string;
  status: VerificationStatus;
};

export type AgencySocialLink = {
  url: string;
  status: VerificationStatus;
  platform: string;
};

export type AgencyAddress = {
  thana: string;
  zilla: string;
  fullAddress: string;
};

export type AgencyNidVerification = {
  nidStatus: VerificationStatus;
  nidRejectReason: string;
};

export type AgencyTradeLicenseVerification = {
  tradeLicenseStatus: VerificationStatus;
  tradeLicenseRejectReason: string;
};

export type AgencyTinVerification = {
  tinStatus: VerificationStatus;
  tinRejectReason: string;
};

export type AgencyBinVerification = {
  binStatus: VerificationStatus;
  binRejectReason: string;
};

export type AgencyBankPayout = {
  bankName: string;
  accStatus: VerificationStatus;
  bankAccNo: string;
  bankRoutingNo: string;
  bankBranchName: string;
  bankAccHolderName: string;
};

export type AgencyMobileBankingPayout = {
  accStatus: VerificationStatus;
  accountNo: string;
  accountType: string;
  accountHolderName: string;
};

export type AgencyPayouts = {
  bank: AgencyBankPayout[];
  mobileBanking: AgencyMobileBankingPayout[];
};

export type AgencyProfileResponse = {
  id: string;
  agencyName: string;
  firstName: string;
  lastName: string;

  email: string;
  primaryPhone: string;
  secondaryPhone: string | null;

  logo: string;
  agencyBio: string;
  serviceFee: string;
  dollarRate: string;
  website: string | null;

  address: AgencyAddress;
  niches: AgencyNiche[];
  socialLinks: AgencySocialLink[];

  nidNumber: string;
  nidFrontImg: string;
  nidBackImg: string;
  nidVerification: AgencyNidVerification;

  tradeLicenseNumber: string;
  tradeLicenseImage: string;
  tradeLicenseVerification: AgencyTradeLicenseVerification;

  tinNumber: string;
  tinImage: string;
  tinVerification: AgencyTinVerification;

  binNumber: string;
  binVerification: AgencyBinVerification;

  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
  isOnboardingComplete: boolean;

  payouts: AgencyPayouts;
  averageRating: string;
  totalReviews: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
