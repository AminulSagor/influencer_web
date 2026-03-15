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
    primaryPhone: string;
    email: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    isBlocked: boolean;
};

export type DollarRateResponse = {
    success: boolean;
    dollarRate: number;
};

export type ServiceFeeResponse = {
    success: boolean;
    serviceFee: string;
};

export type UpdateDollarRatePayload = {
    dollarRate: number | "";
};

export type UpdateServiceFeePayload = {
    serviceFee: string;
};

export type CreateAgencyPayoutPayload = {
    bank?: {
        bankName: string;
        bankAccHolderName: string;
        bankAccNo: string;
        bankBranchName: string;
        bankRoutingNo: string;
    };
    mobileBanking?: {
        accountType: string;
        accountHolderName: string;
        accountNo: string;
    };
};

export type DeleteAgencyPayoutPayload = {
    type: "bank" | "mobile";
    identifier: string;
};

export type DeleteAgencyPayoutResponse = {
    success: boolean;
    message: string;
};

export type UpdateAgencyBasicInfoPayload = {
    agencyName: string;
    agencyBio: string;
    logo: string;
    firstName: string;
    email: string;
    lastName: string;
    secondaryPhone: string;
    website: string;
};

export type UpdateAgencyAddressPayload = {
    address: {
        thana: string;
        zilla: string;
        fullAddress: string;
    };
};

export type UpdateAgencyNichesPayload = {
    niches: string[];
};

export type UpdateAgencySocialLinksPayload = {
    socialLinks: {
        platform: string;
        url: string;
    }[];
};

export type UpdateAgencyNidPayload = {
    nidNumber: string;
    nidFrontImg: string;
    nidBackImg: string;
};

export type UpdateAgencyTradeLicensePayload = {
    tradeLicenseNumber: string;
    tradeLicenseImage: string;
};

export type UpdateAgencyTinPayload = {
    tinNumber: string;
    tinImage: string;
};

export type UpdateAgencyBinPayload = {
    binNumber: string;
};