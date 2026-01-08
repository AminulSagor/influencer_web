// Define the type for platforms
type Platform = {
  title: string;
  nickName: string;
  link: string;
};

// Payout settings can be bank or mobile (Bkash)
type PayoutSetting =
  | {
      id: number;
      type: "Bank Account";
      bankName: string;
      accountHolder: string;
      accountNumber: string;
      routingNumber: string;
      branchName: string;
      status: string;
      phoneNumber?: undefined;
    }
  | {
      id: number;
      type: "Bkash";
      accountHolder: string;
      phoneNumber: string;
      status: string;
      bankName?: undefined;
      accountNumber?: undefined;
      routingNumber?: undefined;
      branchName?: undefined;
    };

// Profile types
type Profile = {
  basicInfo: {
    profileCompletionPercentage: number;
    bio: string;
    niches: string[];
    skills: string[];
  };
  payoutSettings: PayoutSetting[];
  profileDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  nidInfo: {
    nidNumber: string;
  };
  deliveryLocation: {
    title: string;
    location: string;
  }[];
};

// Campaign type
type Campaign = {
  id: number;
  title: string;
  campaignType: string;
  niche: string;
  client: string;
  clientImg: string;
  startDate: string;
  endDate: string;
  clientBudget: number;
  finalQuoteAmount: number;
  status: string;
};

// Full User type
export type User = {
  id: number;
  name: string;
  niche: string[];
  jobDone: number;
  activeJobs: number;
  revenue: number;
  rating: number;
  status: string;
  platforms: Platform[];
  profile: Profile;
  campaigns: Campaign[];
};

// Props for your component
export type UserCardProps = {
  user: User;
};
