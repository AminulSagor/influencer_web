export type AgencyNicheItem = {
    niche: string;
    status: "approved" | "rejected" | "pending";
    rejectReason?: string;
};

export type AgencySocialLinkItem = {
    url: string;
    status: "approved" | "rejected" | "pending";
    platform: string;
};

export type AgencyBankPayoutItem = {
    bankName: string;
    accStatus: "approved" | "rejected" | "pending";
    bankAccNo: string;
    bankRoutingNo: string;
    bankBranchName: string;
    bankAccHolderName: string;
    accRejectReason?: string;
};

export type AgencyMobileBankingPayoutItem = {
    accStatus: "approved" | "rejected" | "pending";
    accountNo: string;
    accountType: string;
    accountHolderName: string;
    accRejectReason?: string;
};

export type AgencyProfileResponse = {
    id: string;
    agencyName: string;
    firstName: string;
    lastName: string;
    secondaryPhone: string;
    logo: string;
    agencyBio: string;
    serviceFee: string;
    dollarRate: string;
    website: string;
    address: {
        thana: string;
        zilla: string;
        fullAddress: string;
    };
    niches: AgencyNicheItem[];
    socialLinks: AgencySocialLinkItem[];
    nidNumber: string;
    nidFrontImg: string;
    nidBackImg: string;
    nidVerification: {
        nidStatus: "approved" | "rejected" | "pending";
        nidRejectReason: string;
    };
    tradeLicenseNumber: string;
    tradeLicenseImage: string;
    tradeLicenseVerification: {
        tradeLicenseStatus: "approved" | "rejected" | "pending";
        tradeLicenseRejectReason: string;
    };
    tinNumber: string;
    tinImage: string;
    tinVerification: {
        tinStatus: "approved" | "rejected" | "pending";
        tinRejectReason: string;
    };
    binNumber: string;
    binVerification: {
        binStatus: "approved" | "rejected" | "pending";
        binRejectReason: string;
    };
    isOnboardingComplete: boolean;
    payouts: {
        bank: AgencyBankPayoutItem[];
        mobileBanking: AgencyMobileBankingPayoutItem[];
    };
    averageRating: string;
    totalReviews: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    isVerified: boolean;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isBlocked: boolean;
};