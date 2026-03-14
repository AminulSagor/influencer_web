// Type for social platforms
type Platform = {
  title: string;
  nickName: string;
  link: string;
};

// Payout settings (either Bank Account or Bkash)
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

// Profile type
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

// User type (influencer)
export type Influencer = {
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

// Full userData type
export type UserData = {
  influencer: Influencer[];
  agency: never[]; // empty array, can update later if you add agency objects
  brand: never[]; // empty array, can update later if you add brand objects
};
