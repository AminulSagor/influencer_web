// types/onboarding/onboarding_payload_type.ts
import { SocialLink } from "./social-link_type";

export type OnboardingPayload = {
  zila: string;
  thana: string;
  fullAddress: string;

  website?: string | null;
  socialLinks: SocialLink[];

  nidNumber?: string | null;
  nidFrontImg?: string | null; 
  nidBackImg?: string | null; 

  tradeLicenseNumber?: string | null;
  tradeLicenseImg?: string | null;

  tinNumber?: string | null;
  tinImage?: string | null;
  binNumber?: string | null;
};