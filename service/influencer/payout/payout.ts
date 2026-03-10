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
