import toast from "react-hot-toast";

//api base url
export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

//success toast
export const notifySuccess = (message: string): void => {
  toast.success(message);
};

//notify error
export const notifyError = (message: string): void => {
  toast.error(message);
};

//format the phoneNumber
export const handlePhoneFormat = (phoneNumber: string) => {
  const rawPhone = phoneNumber.trim();
  const formattedPhone = rawPhone.startsWith("+880")
    ? rawPhone
    : rawPhone.startsWith("880")
    ? `+${rawPhone}`
    : rawPhone.startsWith("01")
    ? `+88${rawPhone}`
    : `+88${rawPhone}`;

  return formattedPhone;
};

//decoder
export type UserRole = "client" | "influencer" | "agency";
type JwtPayload = { role?: UserRole; isVerified?: boolean; exp?: number };

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

//url validator
const normalizeUrl = (raw: string) => raw.trim();
export const isValidHttpUrl = (value: string) => {
  const v = normalizeUrl(value ?? "");
  if (!v) return true;
  try {
    const url = new URL(v);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
