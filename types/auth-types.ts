export type UserType = "client" | "influencer" | "agency" | null;

export interface SignUpFormValues {
  brandName?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginFormValues  {
  phone: string;
  password: string;
};