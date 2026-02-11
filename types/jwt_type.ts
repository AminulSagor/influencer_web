type UserRole = "client" | "influencer" | "agency";
export type JwtPayload = { 
  role?: UserRole; 
  isVerified?: boolean; 
  exp?: number;
  sub?: string;
  email?: string;
  phone?: string;
};