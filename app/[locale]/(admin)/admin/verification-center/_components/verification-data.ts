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
  niche: string[];
  pendingItems: number;
  approvalProgress: number;
  details?: InfluencerDetails;
};

export type VerificationStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Unverified";

export type InfluencerDetails = {
  profile: {
    name: string;
    location: string;
    socialHandles: {
      instagram?: string;
      tiktok?: string;
      twitter?: string;
    };
    verifiedStatus: VerificationStatus;
    bio?: string;
    profileCompletionPercent: number;
  };

  approvalProgress: {
    overallProgress: number;
    stages: {
      name: string;
      status: VerificationStatus;
      approvedCount?: number;
    }[];
  };

  niches: {
    name: string;
    status: VerificationStatus;
  }[];

  socialLinks: {
    platform: string;
    handle: string;
    status: "Accepted" | "Rejected" | "Pending";
  }[];

  skills: {
    name: string;
    status: VerificationStatus;
  }[];

  payoutSettings: {
    id: number;
    type: "Bank Account" | "Bkash";
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    routingNumber?: string;
    branchName?: string;
    phoneNumber?: string;
    status: VerificationStatus;
  }[];

  nidInfo: {
    nidNumber: string;
    frontSideImageUrl: string;
    backSideImageUrl: string;
  };

  personalInfo: {
    firstName: string;
    lastName: string;
    location: string;
    email: string;
    phoneNumber: string;
  };

  deliveryLocations: {
    type: string;
    address: string;
  }[];
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
      details: {
        profile: {
          name: "Hania Amir",
          location: "Dhaka, Bangladesh",
          socialHandles: {
            instagram: "@hanica_amir",
            tiktok: "hania",
            twitter: "@its_hanica",
          },
          verifiedStatus: "Unverified",
          bio: "The Authority In Fashion & Lifestyle Marketing...",
          profileCompletionPercent: 90,
        },
        approvalProgress: {
          overallProgress: 35, // in percent
          stages: [
            { name: "Niches", status: "Approved", approvedCount: 3 },
            { name: "Social Links", status: "Approved", approvedCount: 2 },
            { name: "NID", status: "Approved" },
            { name: "Payment Setup", status: "Approved", approvedCount: 1 },
            { name: "Email", status: "Pending" },
          ],
        },
        niches: [
          { name: "Lifestyle", status: "Approved" },
          { name: "Skincare", status: "Approved" },
          { name: "Vlogging", status: "Approved" },
        ],
        socialLinks: [
          { platform: "Instagram", handle: "@hanica_amir", status: "Accepted" },
          { platform: "TikTok", handle: "@hanica_amir", status: "Accepted" },
          { platform: "Twitter", handle: "@hanica_amir", status: "Accepted" },
        ],
        skills: [
          { name: "Public Speaking", status: "Approved" },
          { name: "Voiceovers", status: "Approved" },
          { name: "Podcasting", status: "Approved" },
          { name: "Product Photography", status: "Approved" },
          { name: "Conversion Optimization", status: "Approved" },
        ],
        payoutSettings: [
          {
            id: 1,
            type: "Bank Account",
            bankName: "Dutch Bangla Bank LTD",
            accountHolder: "Aminul Islam Zahid",
            accountNumber: "32788 798779 7987789",
            routingNumber: "4895697",
            branchName: "Banarose",
            status: "Approved",
          },
          {
            id: 2,
            type: "Bkash",
            phoneNumber: "+8801234567890",
            status: "Approved",
          },
          {
            id: 3,
            type: "Bank Account",
            status: "Pending",
          },
        ],
        nidInfo: {
          nidNumber: "02123 5997 64863",
          frontSideImageUrl: "", // link or placeholder
          backSideImageUrl: "", // link or placeholder
        },
        personalInfo: {
          firstName: "Hania",
          lastName: "Amir",
          location: "Savarpatki, Dhaka",
          email: "grow_biag@gmail.com",
          phoneNumber: "+8801234567890",
        },
        deliveryLocations: [
          {
            type: "House",
            address: "House 31, Road 6, Block B, Banani, Dhaka 1213",
          },
        ],
      },
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
