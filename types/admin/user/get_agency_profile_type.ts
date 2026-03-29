export type AgencyProfileApiResponse = {
  id: string;
  agencyName: string | null;
  firstName: string | null;
  lastName: string | null;
  secondaryPhone: string | null;
  logo: string | null;
  agencyBio: string | null;
  serviceFee: string | null;
  dollarRate: string | null;
  website: string | null;
  address: {
    thana: string | null;
    zilla: string | null;
    fullAddress: string | null;
  } | null;
  niches:
    | {
        niche: string | null;
        status: string | null;
      }[]
    | null;
  socialLinks:
    | {
        url: string | null;
        status: string | null;
        platform: string | null;
      }[]
    | null;
  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;
  nidVerification: {
    nidStatus: string | null;
    nidRejectReason: string | null;
  } | null;
  tradeLicenseNumber: string | null;
  tradeLicenseImage: string | null;
  tradeLicenseVerification: {
    tradeLicenseStatus: string | null;
    tradeLicenseRejectReason: string | null;
  } | null;
  tinNumber: string | null;
  tinImage: string | null;
  tinVerification: {
    tinStatus: string | null;
    tinRejectReason: string | null;
  } | null;
  binNumber: string | null;
  binVerification: {
    binStatus: string | null;
    binRejectReason: string | null;
  } | null;
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
    fcmToken: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};