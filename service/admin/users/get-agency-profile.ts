import { serviceServer } from "@/service/base/axios_server";
import { AgencyProfileApiResponse } from "@/types/admin/user/get_agency_profile_type";

export async function getAgencyProfile(userId: string) {
  const res = await serviceServer.get<AgencyProfileApiResponse>(
    `/influencer/admin/verification/agency/${userId}`
  );

  const item = res.data;

  return {
    id: item?.id ?? "",
    userId: item?.userId ?? "",
    role: item?.user?.role ?? "",
    agencyName: item?.agencyName ?? "",
    firstName: item?.firstName ?? "",
    lastName: item?.lastName ?? "",
    fullName: `${item?.firstName ?? ""} ${item?.lastName ?? ""}`.trim(),
    secondaryPhone: item?.secondaryPhone ?? "",
    logo: item?.logo ?? null,
    agencyBio: item?.agencyBio ?? "",
    serviceFee: item?.serviceFee ?? "",
    dollarRate: item?.dollarRate ?? "",
    website: item?.website ?? "",
    address: {
      thana: item?.address?.thana ?? "",
      zilla: item?.address?.zilla ?? "",
      fullAddress: item?.address?.fullAddress ?? "",
    },
    niches: (item?.niches ?? [])
      .map((nicheItem) => nicheItem?.niche ?? "")
      .filter(Boolean),
    socialLinks: (item?.socialLinks ?? []).map((link) => ({
      url: link?.url ?? "",
      status: link?.status ?? "",
      platform: link?.platform ?? "",
    })),
    nidNumber: item?.nidNumber ?? "",
    nidFrontImg: item?.nidFrontImg ?? "",
    nidBackImg: item?.nidBackImg ?? "",
    tradeLicenseNumber: item?.tradeLicenseNumber ?? "",
    tradeLicenseImage: item?.tradeLicenseImage ?? "",
    tinNumber: item?.tinNumber ?? "",
    tinImage: item?.tinImage ?? "",
    binNumber: item?.binNumber ?? "",
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