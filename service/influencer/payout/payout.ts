import { serviceClient } from "../../base/axios_client";

export interface BankPayoutRequest {
  bank: {
    bankName: string;
    bankAccHolderName: string;
    bankAccNo: string;
    bankBranchName: string;
    bankRoutingNo: string;
  };
}

export interface MobileBankingPayoutRequest {
  mobileBanking: {
    accountType: string;
    accountHolderName: string;
    accountNo: string;
  };
}

export interface PayoutResponse {
  message: string;
  data?: any;
}

export const addBankPayout = async (
  data: BankPayoutRequest
): Promise<PayoutResponse> => {
  const response = await serviceClient.post(`/influencer/profile/payouts`, data);
  return response.data;
};

export const addMobileBankingPayout = async (
  data: MobileBankingPayoutRequest
): Promise<PayoutResponse> => {
  const response = await serviceClient.post(`/influencer/profile/payouts`, data);
  return response.data;
};

export interface DeletePayoutRequest {
  type: "bank" | "mobile";
  identifier: string;
}

export const deletePayout = async (
  data: DeletePayoutRequest
): Promise<PayoutResponse> => {
  const response = await serviceClient.delete(`/influencer/profile/payouts`, {
    data: data
  });
  return response.data;
};

/**
 * Update payout settings (bank + mobile banking)
 * PATCH /influencer/profile/edit/payouts
 */
export interface UpdatePayoutRequest {
  bank?: Array<{
    bankName: string;
    bankAccHolderName: string;
    bankAccNo: string;
    bankBranchName: string;
    bankRoutingNo: string;
    accStatus: string;
  }>;
  mobileBanking?: Array<{
    accountType: string;
    accountHolderName: string;
    accountNo: string;
    accStatus: string;
  }>;
}

export const updatePayout = async (
  data: UpdatePayoutRequest
): Promise<PayoutResponse> => {
  const response = await serviceClient.patch(`/influencer/profile/edit/payouts`, data);
  return response.data;
};
