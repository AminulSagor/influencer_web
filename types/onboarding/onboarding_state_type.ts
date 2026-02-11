import { AddressFormValues } from "@/schemas/onboarding/address_schema";
import { UserRole } from "../auth/role_type";
import { OnboardingPayload } from "./onboarding_payload_type";
import { SocialLink } from "./social-link_type";
import { AgencyPlatform } from "../agency/agency-platform_type";

// types/onboarding/onboarding_state_type.ts
export type OnboardingState = {
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  
  // STEP 5 - Address
  address: AddressFormValues;
  setAddress: (address: AddressFormValues) => void;
  // No country field here
  
  // STEP 6 - Socials
  website: string;
  socialLinks: SocialLink[];
  setWebsite: (v: string) => void;
  setSocialLinks: (links: SocialLink[]) => void;
  
  // STEP 6 - Agency Expertise
  agencyExpertise: {
    platforms: AgencyPlatform[];
  };
  setAgencyExpertise: (expertise: { platforms: AgencyPlatform[] }) => void;
  addAgencyPlatform: (platform: AgencyPlatform) => void;
  removeAgencyPlatform: (index: number) => void;
  updateAgencyPlatform: (index: number, platform: AgencyPlatform) => void;
  
  // Step 7 - NID
  nidNumber: string;
  nidFrontImg: string;
  nidBackImg: string;
  setNidInfo: (nid: { 
    nidNumber?: string; 
    nidFrontImg?: string; 
    nidBackImg?: string; 
  }) => void;
  
  // Step 8 - Trade License (for clients)
  tradeLicenseNumber: string;
  tradeLicenseImg: string;
  setTradeLicenseInfo: (tradeLicense: { 
    tradeLicenseNumber?: string; 
    tradeLicenseImg?: string; 
  }) => void;
  
  // Step 9 - TIN/BIN (for clients)
  tinNumber: string;
  tinImage: string;
  binNumber: string;
  setTinBinInfo: (tinBin: { 
    tinNumber?: string; 
    tinImage?: string; 
    binNumber?: string; 
  }) => void;
  
  // FINAL
  toPayload: () => OnboardingPayload;
};