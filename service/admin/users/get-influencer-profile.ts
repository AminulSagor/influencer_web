import { serviceServer } from "@/service/base/axios_server";
import { InfluencerProfileApiResponse } from "@/types/admin/user/get_influencer_profile_type";

export async function getInfluencerProfile(userId: string) {
  const res = await serviceServer.get<InfluencerProfileApiResponse>(
    `/influencer/admin/verification/profile/${userId}`
  );

  const item = res.data?.data;

  return {
    id: item?.id ?? "",
    userId: item?.userId ?? "",
    firstName: item?.firstName ?? "",
    lastName: item?.lastName ?? "",
    role: item?.user?.role ?? "",
    fullName: `${item?.firstName ?? ""} ${item?.lastName ?? ""}`.trim(),
    bio: item?.bio ?? "",
    profileImg: item?.profileImg ?? null,

    niches: (item?.niches ?? [])
      .map((nicheItem) => nicheItem?.niche ?? "")
      .filter(Boolean),

    skills: (item?.skills ?? [])
      .map((skillItem) => skillItem?.skill ?? "")
      .filter(Boolean),

    website: item?.website ?? "",

    socialLinks: (item?.socialLinks ?? []).map((link) => ({
      url: link?.url ?? "",
      platform: link?.platform ?? "",
    })),

    addresses: (item?.addresses ?? []).map((address) => ({
      thana: address?.thana ?? "",
      zilla: address?.zilla ?? "",
      country: address?.country ?? "",
      addressName: address?.addressName ?? "",
      fullAddress: address?.fullAddress ?? "",
    })),

    nidNumber: item?.nidNumber ?? "",
    nidFrontImg: item?.nidFrontImg ?? "",
    nidBackImg: item?.nidBackImg ?? "",
    isOnboardingComplete: item?.isOnboardingComplete ?? false,
    averageRating: Number(item?.averageRating ?? 0),
    totalReviews: item?.totalReviews ?? 0,
    email: item?.user?.email ?? "",
    phone: item?.user?.phone ?? "",
    isVerified: item?.user?.isVerified ?? false,
    isPhoneVerified: item?.user?.isPhoneVerified ?? false,
    isEmailVerified: item?.user?.isEmailVerified ?? false,
    isBlocked: item?.user?.isBlocked ?? false,

    payouts: {
      bank: (item?.payouts?.bank ?? []).map((bank, index) => ({
        id: `bank-${index + 1}`,
        type: "Bank Account" as const,
        bankName: bank?.bankName ?? "",
        accountHolder: bank?.bankAccHolderName ?? "",
        accountNumber: bank?.bankAccNo ?? "",
        routingNumber: bank?.bankRoutingNo ?? "",
        branchName: bank?.bankBranchName ?? "",
        status: bank?.accStatus ?? "pending",
      })),
      mobileBanking: (item?.payouts?.mobileBanking ?? []).map((mobile, index) => ({
        id: `mobile-${index + 1}`,
        type: (mobile?.accountType as "Bkash") || "Bkash",
        phoneNumber: mobile?.accountNo ?? "",
        accountHolder: mobile?.accountHolderName ?? "",
        status: mobile?.accStatus ?? "pending",
      })),
    },
  };
}