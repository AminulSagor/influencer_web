import { SocialLink } from "./social_link_type";
import { AgencyExpertise } from "../agency/agency-expertise_type";

export type OnboardingPayload = {
  // Address - as per backend DTO
  zilla: string;
  thana: string;
  fullAddress: string;

  // Agency Specific
  niches: string[]; 

  // Socials
  website?: string | null;
  socialLinks: SocialLink[];

  // Verification
  nidNumber?: string | null;
  nidFrontImg?: string | null; 
  nidBackImg?: string | null; 

  // Business (for clients)
  tradeLicenseNumber?: string | null;
  tradeLicenseImg?: string | null;

  tinNumber?: string | null;
  tinImage?: string | null;
  binNumber?: string | null;
};