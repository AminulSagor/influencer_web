type CampaignContentType = {
  id: number;
  title: string;
  description: string;
  day: string; // ex: "Day 1", "Day 2"
};

export const campaignContents: CampaignContentType[] = [
  {
    id: 1,
    title: "Initial Content Creation",
    description: "2 Instagram posts + 3 stories",
    day: "Day 1",
  },
  {
    id: 2,
    title: "Brand Awareness Boost",
    description: "Influencer shoutout + repost",
    day: "Day 2",
  },
  {
    id: 3,
    title: "Engagement Push",
    description: "Interactive poll + story Q&A",
    day: "Day 3",
  },
  {
    id: 4,
    title: "Highlight Reel Promotion",
    description: "Short video reel + CTA",
    day: "Day 4",
  },
  {
    id: 5,
    title: "Conversion Focus Campaign",
    description: "Swipe-up affiliate link + discount mention",
    day: "Day 5",
  },
];
