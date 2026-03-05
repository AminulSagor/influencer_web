export interface LoginPayload {
  phone: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  message: string;
}
