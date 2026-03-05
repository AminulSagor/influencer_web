import { UserRole } from "./role_type";

export type SignupPayload = {
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  brandName?: string;
};

export type SignupResponse = {
  id?: string;
  role?: UserRole;
};