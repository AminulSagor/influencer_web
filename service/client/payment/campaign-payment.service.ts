import { serviceClient } from "@/service/base/axios_client";
import { ServiceResponse } from "@/types/service-response";

export type LocaleCode = "en" | "bn";

export type PaymentSessionResponse = {
  campaignId: string;
  campaignType: string;
  requestedAmount: number;
  totalBudget: number;
  paidAmount: number;
  dueAmount: number;
  paymentId: string;
  tranId: string;
  sessionKey: string;
  gatewayUrl: string;
  status: string;
};

export type CreatePaymentPayload = {
  campaignId: string;
  amount: number;
  locale: LocaleCode;
};

export async function createPaymentSession(
  payload: CreatePaymentPayload,
): Promise<ServiceResponse<PaymentSessionResponse>> {
  console.log("payload", payload);
  const response = await serviceClient.post<
    ServiceResponse<PaymentSessionResponse>
  >("/campaign/client/campaign/pay", payload);

  return response.data;
}

export async function createPayDueSession(
  payload: CreatePaymentPayload,
): Promise<ServiceResponse<PaymentSessionResponse>> {
  console.log(payload);
  const response = await serviceClient.post<
    ServiceResponse<PaymentSessionResponse>
  >("/campaign/client/pay-due", payload);

  return response.data;
}
