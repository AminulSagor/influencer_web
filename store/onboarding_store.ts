import { create } from "zustand";
import { OnboardingPayload } from "@/types/onboarding/onboarding_payload_type";
import { SocialPlatform } from "@/types/onboarding/social-link_type";
import type { AddressFormValues } from "@/schemas/onboarding/address_schema";
import { OnboardingState } from "@/types/onboarding/onboarding_state_type";

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  // step 5
  address: {
    zila: "",
    thana: "",
    fullAddress: "",
  },
  setAddress: (address) => set({ address }),

  // step 6
  website: "",
  socialLinks: [{ platform: "", profileUrl: "" }],
  setWebsite: (website) => set({ website }),
  setSocialLinks: (socialLinks) => set({ socialLinks }),

  // Step 7
  nidNumber: "",
  nidFrontImg: "",
  nidBackImg: "",
  setNidInfo: (nid) => set(nid),

  // Step 8 - Trade License
  tradeLicenseNumber: "",
  tradeLicenseImg: "",
  setTradeLicenseInfo: (tradeLicense) => set(tradeLicense),

  // Step 9 - TIN/BIN
  tinNumber: "",
  tinImage: "",
  binNumber: "",
  setTinBinInfo: (tinBin) => set(tinBin),

  // payload builder - UPDATED TO INCLUDE ALL FIELDS
  toPayload: () => {
    const { 
      address, 
      website, 
      socialLinks, 
      nidNumber, 
      nidFrontImg, 
      nidBackImg,
      tradeLicenseNumber,
      tradeLicenseImg,
      tinNumber,
      tinImage,
      binNumber
    } = get();

    return {
      zila: address.zila,
      thana: address.thana,
      fullAddress: address.fullAddress,

      website: website.trim() || null,

      socialLinks: socialLinks
        .filter((l) => l.platform && l.profileUrl)
        .map((l) => ({
          platform: l.platform as SocialPlatform,
          profileUrl: l.profileUrl.trim(),
        })),

      nidNumber: nidNumber.trim() || null,
      nidFrontImg: nidFrontImg.trim() || null,
      nidBackImg: nidBackImg.trim() || null,

      tradeLicenseNumber: tradeLicenseNumber.trim() || null,
      tradeLicenseImg: tradeLicenseImg.trim() || null,

      tinNumber: tinNumber.trim() || null,
      tinImage: tinImage.trim() || null,
      binNumber: binNumber.trim() || null,
    };
  },
}));