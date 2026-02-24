export type ClientListItem = {
  id: string;
  brandName: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImg: string | null;
  email: string;
  phone: string;
  thana: string | null;
  zilla: string | null;
  fullAddress: string | null;
  country: string | null;
  website: string | null;
  socialLinks:
    | {
        url: string;
        status: string;
        platform: string;
      }[]
    | null;
  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;
  nidVerification: { nidStatus: string; nidRejectReason: string } | null;
  isOnboardingComplete: boolean;
  userId: string;
  user: {
    id: string;
    email: string;
    phone: string;
    role: "client";
    isVerified: boolean;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isBlocked: boolean;
    fcmToken: string | null;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};