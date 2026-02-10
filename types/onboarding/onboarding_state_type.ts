import type { AddressFormValues } from "@/schemas/onboarding/address_schema";
import { SocialLink } from "./social-link_type";
import { OnboardingPayload } from "./onboarding_payload_type";

export type OnboardingState = {
  // STEP 5
  address: AddressFormValues;
  setAddress: (address: AddressFormValues) => void;

  // STEP 6
  website: string;
  socialLinks: SocialLink[];
  setWebsite: (v: string) => void;
  setSocialLinks: (links: SocialLink[]) => void;

  // Step 7
  nidNumber: string;
  nidFrontImg: string;
  nidBackImg: string;
  setNidInfo: (nid: { 
    nidNumber?: string; 
    nidFrontImg?: string; 
    nidBackImg?: string; 
  }) => void;

  // Step 8 - Trade License
  tradeLicenseNumber: string;
  tradeLicenseImg: string;
  setTradeLicenseInfo: (tradeLicense: { 
    tradeLicenseNumber?: string; 
    tradeLicenseImg?: string; 
  }) => void;

  // Step 9 - TIN/BIN
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