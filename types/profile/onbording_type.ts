export type SocialPlatform = "facebook" | "instagram" | "tiktok" | "youtube" | "x";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

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
};
