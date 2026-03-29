import { serviceClient } from "@/service/base/axios_client";
import type {
    AgencyProfileResponse,
    CreateAgencyPayoutPayload,
    DeleteAgencyPayoutPayload,
    DeleteAgencyPayoutResponse,
    DollarRateResponse,
    ServiceFeeResponse,
    UpdateAgencyAddressPayload,
    UpdateAgencyBasicInfoPayload,
    UpdateAgencyBinPayload,
    UpdateAgencyEmailPayload,
    UpdateAgencyNichesPayload,
    UpdateAgencyNidPayload,
    UpdateAgencySocialLinksPayload,
    UpdateAgencyTinPayload,
    UpdateAgencyTradeLicensePayload,
    UpdateDollarRatePayload,
    UpdateServiceFeePayload,
} from "@/types/agency/account-settings";

export const getAgencyProfile =
    async (): Promise<AgencyProfileResponse> => {
        const response = await serviceClient.get<AgencyProfileResponse>(
            "/agency/profile"
        );

        return response.data;
    };

export const getAgencyDollarRate =
    async (): Promise<DollarRateResponse> => {
        const response = await serviceClient.get<DollarRateResponse>(
            "/agency/profile/dollar-rate"
        );

        return response.data;
    };

export const getAgencyServiceFee =
    async (): Promise<ServiceFeeResponse> => {
        const response = await serviceClient.get<ServiceFeeResponse>(
            "/agency/profile/service-fee"
        );

        return response.data;
    };

export const updateAgencyDollarRate =
    async (payload: UpdateDollarRatePayload) => {
        const response = await serviceClient.patch(
            "/agency/profile/dollar-rate",
            payload
        );

        return response.data;
    };

export const updateAgencyServiceFee =
    async (payload: UpdateServiceFeePayload) => {
        const response = await serviceClient.patch(
            "/agency/profile/service-fee",
            payload
        );

        return response.data;
    };

export const createAgencyPayout = async (
    payload: CreateAgencyPayoutPayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.post<AgencyProfileResponse>(
        "/agency/profile/payouts",
        payload
    );

    return response.data;
};

export const deleteAgencyPayout = async (
    payload: DeleteAgencyPayoutPayload
): Promise<DeleteAgencyPayoutResponse> => {
    const response = await serviceClient.delete<DeleteAgencyPayoutResponse>(
        "/agency/profile/payouts",
        { data: payload }
    );

    return response.data;
};

export const updateAgencyBasicInfo = async (
    payload: UpdateAgencyBasicInfoPayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.patch<AgencyProfileResponse>(
        "/agency/profile/basic-info",
        payload
    );

    return response.data;
};

export const updateAgencyEmail = async (
    payload: UpdateAgencyEmailPayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.patch<AgencyProfileResponse>(
        "/influencer/auth/agency/email",
        payload
    );

    return response.data;
};

export const updateAgencyAddress = async (
    payload: UpdateAgencyAddressPayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.patch<AgencyProfileResponse>(
        "/agency/profile/address",
        payload
    );

    return response.data;
};

export const updateAgencyNiches = async (
    payload: UpdateAgencyNichesPayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.patch<AgencyProfileResponse>(
        "/agency/profile/niches",
        payload
    );

    return response.data;
};

export const updateAgencySocialLinks = async (
    payload: UpdateAgencySocialLinksPayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.patch<AgencyProfileResponse>(
        "/agency/profile/socials",
        payload
    );

    return response.data;
};

export const updateAgencyNid = async (
    payload: UpdateAgencyNidPayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.patch<AgencyProfileResponse>(
        "/agency/profile/verification/nid",
        payload
    );

    return response.data;
};

export const updateAgencyTradeLicense = async (
    payload: UpdateAgencyTradeLicensePayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.patch<AgencyProfileResponse>(
        "/agency/profile/verification/trade-license",
        payload
    );

    return response.data;
};

export const updateAgencyTin = async (
    payload: UpdateAgencyTinPayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.patch<AgencyProfileResponse>(
        "/agency/profile/verification/tin",
        payload
    );

    return response.data;
};

export const updateAgencyBin = async (
    payload: UpdateAgencyBinPayload
): Promise<AgencyProfileResponse> => {
    const response = await serviceClient.patch<AgencyProfileResponse>(
        "/agency/profile/verification/bin",
        payload
    );

    return response.data;
};