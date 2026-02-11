import { create } from "zustand";
import { SocialPlatform } from "@/types/onboarding/social-link_type";
import { OnboardingState } from "@/types/onboarding/onboarding_state_type";
import { UserRole } from "@/types/auth/role_type";
import { AgencyPlatform } from "@/types/agency/agency-platform_type";

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  userRole: null,
  setUserRole: (role: UserRole) => set({ userRole: role }),

  address: {
    //Issue Zila and Zilla
    zila: "",
    thana: "",
    fullAddress: "",
  },
  setAddress: (address) => set({ address }),

  website: "",
  socialLinks: [{ platform: "", profileUrl: "" }],
  setWebsite: (website) => set({ website }),
  setSocialLinks: (socialLinks) => set({ socialLinks }),

  agencyExpertise: {
    platforms: []
  },
  setAgencyExpertise: (agencyExpertise) => set({ agencyExpertise }),
  addAgencyPlatform: (platform: AgencyPlatform) => 
    set((state) => ({
      agencyExpertise: {
        platforms: [...state.agencyExpertise.platforms, platform]
      }
    })),
  removeAgencyPlatform: (index: number) => 
    set((state) => ({
      agencyExpertise: {
        platforms: state.agencyExpertise.platforms.filter((_, i) => i !== index)
      }
    })),
  updateAgencyPlatform: (index: number, platform: AgencyPlatform) => 
    set((state) => {
      const newPlatforms = [...state.agencyExpertise.platforms];
      newPlatforms[index] = platform;
      return {
        agencyExpertise: {
          platforms: newPlatforms
        }
      };
    }),

  nidNumber: "",
  nidFrontImg: "",
  nidBackImg: "",
  setNidInfo: (nid) => set(nid),

  tradeLicenseNumber: "",
  tradeLicenseImg: "",
  setTradeLicenseInfo: (tradeLicense) => set(tradeLicense),

  tinNumber: "",
  tinImage: "",
  binNumber: "",
  setTinBinInfo: (tinBin) => set(tinBin),

  toPayload: () => {
    const state = get();
    
    const validSocialLinks = state.socialLinks
      .filter(l => l.platform?.trim() && l.profileUrl?.trim())
      .map(l => ({
        platform: l.platform.trim() as SocialPlatform,
        //issue url and profileUrl
        url: l.profileUrl.trim()
      }));

    const payload: any = {
      zilla: state.address.zila.trim(),
      thana: state.address.thana.trim(),
      fullAddress: state.address.fullAddress.trim(),
      nidNumber: state.nidNumber.trim() || null,
      nidFrontImg: state.nidFrontImg.trim() || null,
      nidBackImg: state.nidBackImg.trim() || null,
      socialLinks: validSocialLinks
    };

    if (validSocialLinks.length === 0) {
      throw new Error("Please add at least one valid social link");
    }

    if (state.userRole === 'agency') {
      const allNiches = state.agencyExpertise.platforms
        .flatMap(p => p.niches)
        .filter((niche, i, arr) => arr.indexOf(niche) === i);
      
      payload.niches = allNiches;
      
      if (state.website.trim()) {
        payload.website = state.website.trim();
      }
      
    } else if (state.userRole === 'client') {
      if (state.website.trim()) {
        payload.website = state.website.trim();
      }
      
      if (state.tradeLicenseNumber.trim()) {
        payload.tradeLicenseNumber = state.tradeLicenseNumber.trim();
      }
      if (state.tradeLicenseImg.trim()) {
        payload.tradeLicenseImg = state.tradeLicenseImg.trim();
      }
      if (state.tinNumber.trim()) {
        payload.tinNumber = state.tinNumber.trim();
      }
      if (state.tinImage.trim()) {
        payload.tinImage = state.tinImage.trim();
      }
      if (state.binNumber.trim()) {
        payload.binNumber = state.binNumber.trim();
      }
    }

    return payload;
  },
}));