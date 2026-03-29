export type NewJobOfferItem = {
    id: string;
    campaignName: string;
    status: string;
    client: {
        brandName: string;
        profileImg: string | null;
    };
    platforms: string[];
    financials: {
        totalBudget: number;
        availableBudgetForExecution: number;
        adminOfferedServiceFeePercent: number;
        adminPlatformFee: number;
    };
    schedule: {
        startingDate: string;
        duration: number;
        deadline: string;
    };
    invitedAt?: string;
    timeLeftToRequoteMinutes?: number;
    dueDays?: number;
    progressPercent?: number;
    completedOn?: string;
    rating?: string;
};

export type NewJobOffersResponse = {
    success: boolean;
    data: NewJobOfferItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};