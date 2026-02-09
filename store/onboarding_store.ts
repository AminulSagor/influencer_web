// import { OnboardingPayload } from "@/types/profile/onbording_type";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// type OnboardingState = {
//   data: OnboardingPayload;

//   setAddress: (v: Pick<OnboardingPayload, "zila" | "thana" | "fullAddress">) => void;
//   setWebsite: (website: string) => void;

//   setSocialLinks: (links: SocialLink[]) => void;
//   addSocialLink: (link: SocialLink) => void;
//   removeSocialLink: (platform: SocialLink["platform"]) => void;

//   setNid: (v: Pick<OnboardingPayload, "nidNumber" | "nidFrontImg" | "nidBackImg">) => void;
//   setTrade: (v: Pick<OnboardingPayload, "tradeLicenseNumber" | "tradeLicenseImg">) => void;

//   resetOnboarding: () => void;
// };

// const initialData: OnboardingPayload = {
//   zila: "",
//   thana: "",
//   fullAddress: "",
//   website: "",
//   socialLinks: [],
//   nidNumber: "",
//   nidFrontImg: "",
//   nidBackImg: "",
//   tradeLicenseNumber: "",
//   tradeLicenseImg: "",
// };

// export const useOnboardingStore = create<OnboardingState>()(
//   persist(
//     (set, get) => ({
//       data: initialData,

//       setAddress: (v) =>
//         set((s) => ({ data: { ...s.data, ...v } })),

//       setWebsite: (website) =>
//         set((s) => ({ data: { ...s.data, website } })),

//       setSocialLinks: (links) =>
//         set((s) => ({ data: { ...s.data, socialLinks: links } })),

//       addSocialLink: (link) =>
//         set((s) => ({
//           data: {
//             ...s.data,
//             socialLinks: [
//               ...s.data.socialLinks.filter((x) => x.platform !== link.platform),
//               link,
//             ],
//           },
//         })),

//       removeSocialLink: (platform) =>
//         set((s) => ({
//           data: {
//             ...s.data,
//             socialLinks: s.data.socialLinks.filter((x) => x.platform !== platform),
//           },
//         })),

//       setNid: (v) =>
//         set((s) => ({ data: { ...s.data, ...v } })),

//       setTrade: (v) =>
//         set((s) => ({ data: { ...s.data, ...v } })),

//       resetOnboarding: () => set({ data: initialData }),
//     }),
//     { name: "onboarding-store" }
//   )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AddressFormValues } from "@/schemas/onboarding/address_schema";

type OnboardingState = {
  address: AddressFormValues;
  setAddress: (v: AddressFormValues) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      address: { zila: "", thana: "", fullAddress: "" },
      setAddress: (v) => set({ address: v }),
    }),
    { name: "onboarding-store" }
  )
);
