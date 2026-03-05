export type VerifyOtpPayload = {
  phone: string;
  otp: string;
};

export type VerifyOtpResponse = {
  token: string;
};