// action-items.data.ts
import { ActionType } from "./action-item.config";

export type ActionItemData = {
  id: number;
  type: ActionType;
  title: string;
  description: string;
  user: string;
  time: string;
};

export const ACTION_ITEMS: ActionItemData[] = [
  {
    id: 1,
    type: "campaign",
    title: "New Campaign Request - Budget ৳ 3,00,000",
    description: "Influencer Promotion",
    user: "StyleCo",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "verification",
    title: "Pending Verification - NID",
    description: "Influencer - Hania Amir submitted NID for verification",
    user: "Hania Amir",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "payout",
    title: "Payout Request - Campaign ‘Summer Sale’",
    description: "Influencer completed campaign - Pending ৳ 3,000",
    user: "Hania Amir",
    time: "5 hours ago",
  },
  {
    id: 4,
    type: "milestone",
    title: "Milestone Review - Milestone 3 of campaign ‘Summer Sale’",
    description: "Agency provided submission 1 - Requested ৳ 3,000",
    user: "GrowBig",
    time: "7 hours ago",
  },

  // -------- duplicate variations to make 15 --------
  {
    id: 5,
    type: "campaign",
    title: "New Campaign Request - Budget ৳ 1,50,000",
    description: "Facebook Ads Promotion",
    user: "UrbanWear",
    time: "1 hour ago",
  },
  {
    id: 6,
    type: "verification",
    title: "Pending Verification - Trade License",
    description: "Agency - GrowBig submitted documents",
    user: "GrowBig",
    time: "3 hours ago",
  },
  {
    id: 7,
    type: "payout",
    title: "Payout Request - Campaign ‘Flash Sale’",
    description: "Influencer completed campaign - Pending ৳ 5,500",
    user: "Ayman Khan",
    time: "6 hours ago",
  },
  {
    id: 8,
    type: "milestone",
    title: "Milestone Review - Milestone 1 of ‘Winter Fest’",
    description: "Agency provided submission 2 - Requested ৳ 10,000",
    user: "MediaHive",
    time: "8 hours ago",
  },
  {
    id: 9,
    type: "campaign",
    title: "New Campaign Request - Budget ৳ 90,000",
    description: "Instagram Reels Promotion",
    user: "FoodiesBD",
    time: "9 hours ago",
  },
  {
    id: 10,
    type: "verification",
    title: "Pending Verification - Bank Account",
    description: "Influencer submitted bank details for verification",
    user: "Nusrat Jahan",
    time: "10 hours ago",
  },
  {
    id: 11,
    type: "payout",
    title: "Payout Request - Campaign ‘Mega Sale’",
    description: "Influencer completed campaign - Pending ৳ 12,000",
    user: "Tanvir Hasan",
    time: "12 hours ago",
  },
  {
    id: 12,
    type: "milestone",
    title: "Milestone Review - Milestone 2 of ‘Brand Boost’",
    description: "Agency provided submission 3 - Requested ৳ 7,500",
    user: "AdSpark",
    time: "14 hours ago",
  },
  {
    id: 13,
    type: "campaign",
    title: "New Campaign Request - Budget ৳ 4,50,000",
    description: "YouTube Brand Integration",
    user: "TechZone",
    time: "1 day ago",
  },
  {
    id: 14,
    type: "verification",
    title: "Pending Verification - Identity Document",
    description: "Influencer submitted updated identity proof",
    user: "Sadia Islam",
    time: "1 day ago",
  },
  {
    id: 15,
    type: "payout",
    title: "Payout Request - Campaign ‘Weekend Deals’",
    description: "Influencer completed campaign - Pending ৳ 2,200",
    user: "Rafi Ahmed",
    time: "2 days ago",
  },
];
