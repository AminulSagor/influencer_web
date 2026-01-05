export type SocialPlatform = "instagram" | "youtube" | "tiktok";
export type PersonType = "tvc_actress" | "fashion" | "influencer" | "artist";
interface Influener {
  id: string;
  name: string;
  avatarUrl?: string;
  types: PersonType[];
  socials: Array<{
    platform: SocialPlatform;
    url?: string;
  }>;
  rating: number;
}

interface Agency {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  rating: number;
}

export const influencers: Influener[] = [
  {
    id: "u1",
    name: "Hania Amir",
    types: ["tvc_actress", "fashion"],
    socials: [
      { platform: "instagram" },
      { platform: "youtube" },
      { platform: "tiktok" },
    ],
    rating: 4.5,
  },
  {
    id: "u2",
    name: "Nusrat Faria",
    types: ["tvc_actress", "fashion"],
    socials: [
      { platform: "instagram" },
      { platform: "youtube" },
      { platform: "tiktok" },
    ],
    rating: 4.2,
  },
  {
    id: "u3",
    name: "Mehazabien Chowdhury",
    types: ["tvc_actress", "influencer"],
    socials: [
      { platform: "instagram" },
      { platform: "youtube" },
      { platform: "tiktok" },
    ],
    rating: 4.7,
  },
  {
    id: "u4",
    name: "Sabila Nur",
    types: ["tvc_actress", "fashion"],
    socials: [
      { platform: "instagram" },
      { platform: "youtube" },
      { platform: "tiktok" },
    ],
    rating: 4.4,
  },
  {
    id: "u5",
    name: "Tanjin Tisha",
    types: ["tvc_actress", "artist"],
    socials: [
      { platform: "instagram" },
      { platform: "youtube" },
      { platform: "tiktok" },
    ],
    rating: 4.1,
  },
  {
    id: "u6",
    name: "Keya Payel",
    types: ["influencer", "fashion"],
    socials: [
      { platform: "instagram" },
      { platform: "youtube" },
      { platform: "tiktok" },
    ],
    rating: 4.0,
  },
];

export const agencies: Agency[] = [
  {
    id: "b1",
    name: "Grow Big",
    category: "Real State Advertising",
    rating: 4.5,
  },
  {
    id: "b2",
    name: "AdNest",
    category: "Digital Marketing Agency",
    rating: 4.3,
  },
  {
    id: "b3",
    name: "Urban Reach",
    category: "Real Estate Promotion",
    rating: 4.6,
  },
  {
    id: "b4",
    name: "BoostLab",
    category: "Performance Advertising",
    rating: 4.4,
  },
  {
    id: "b5",
    name: "Brandify",
    category: "Creative Branding Studio",
    rating: 4.2,
  },
  {
    id: "b6",
    name: "MarketPro",
    category: "Lead Generation Agency",
    rating: 4.1,
  },
];
