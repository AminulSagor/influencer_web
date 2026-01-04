// verification-data.ts
export type VerificationCardDataType = {
  id: number;
  label: "Influencer" | "Brand" | "Agency";
  count: number;
  status: "Pending";
};

export const verificationData: VerificationCardDataType[] = [
  { id: 1, label: "Influencer", count: 43, status: "Pending" },
  { id: 2, label: "Brand", count: 12, status: "Pending" },
  { id: 3, label: "Agency", count: 7, status: "Pending" },
];
