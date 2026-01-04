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

export type VerificationTableRow = {
  id: number;
  name: string;
  niche: string[]; // changed to array of strings
  pendingItems: number;
  approvalProgress: number;
};

export const verificationTableData: Record<
  "Influencer" | "Brand" | "Agency",
  VerificationTableRow[]
> = {
  Influencer: [
    {
      id: 1,
      name: "Hania Amir",
      niche: ["Lifestyle", "Skincare", "Fitness", "Travel", "Food"],
      pendingItems: 3,
      approvalProgress: 30,
    },
    {
      id: 2,
      name: "Ali Khan",
      niche: ["Fitness", "Nutrition"],
      pendingItems: 1,
      approvalProgress: 70,
    },
  ],
  Brand: [
    {
      id: 1,
      name: "Brand XYZ",
      niche: ["Lifestyle", "Skincare", "Fitness", "Travel", "Food"],
      pendingItems: 2,
      approvalProgress: 50,
    },
  ],
  Agency: [
    {
      id: 1,
      name: "Agency 123",
      niche: ["Lifestyle", "Skincare", "Fitness", "Travel", "Food"],
      pendingItems: 4,
      approvalProgress: 20,
    },
  ],
};
