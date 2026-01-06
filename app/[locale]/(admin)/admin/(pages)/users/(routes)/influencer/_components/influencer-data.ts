interface SocialStats {
  followers: string;
  engagement: string;
  posts: number;
}

interface Influencer {
  id: string;
  name: string;
  category: string;
  rating: number;
  socialStats: SocialStats;
  image?: string;
}

// Data
const influencersData: Influencer[] = [
  {
    id: "1",
    name: "Hazbo Amir",
    category: "Fashion",
    rating: 4.5,
    socialStats: { followers: "2.5M", engagement: "4.8%", posts: 234 },
  },
  {
    id: "2",
    name: "Salman Mudassar",
    category: "Lifestyle",
    rating: 5.0,
    socialStats: { followers: "3.2M", engagement: "5.2%", posts: 456 },
  },
  {
    id: "3",
    name: "Raftaar The Choudhuri",
    category: "Music",
    rating: 4.8,
    socialStats: { followers: "4.1M", engagement: "6.1%", posts: 189 },
  },
  {
    id: "4",
    name: "Hazbo Amir",
    category: "Fashion",
    rating: 4.7,
    socialStats: { followers: "2.8M", engagement: "4.5%", posts: 312 },
  },
  {
    id: "5",
    name: "Salman Mudassar",
    category: "Tech",
    rating: 4.9,
    socialStats: { followers: "1.9M", engagement: "5.8%", posts: 567 },
  },
  {
    id: "6",
    name: "Raftaar The Choudhuri",
    category: "Sports",
    rating: 4.6,
    socialStats: { followers: "3.5M", engagement: "4.9%", posts: 423 },
  },
  {
    id: "7",
    name: "Hazbo On The Go",
    category: "Travel",
    rating: 4.8,
    socialStats: { followers: "2.1M", engagement: "5.5%", posts: 289 },
  },
  {
    id: "8",
    name: "Nadir",
    category: "Food",
    rating: 4.5,
    socialStats: { followers: "1.7M", engagement: "4.2%", posts: 378 },
  },
  {
    id: "9",
    name: "Saloba Nur",
    category: "Beauty",
    rating: 4.9,
    socialStats: { followers: "3.8M", engagement: "6.3%", posts: 501 },
  },
  {
    id: "10",
    name: "Nazib On The Go",
    category: "Fitness",
    rating: 4.7,
    socialStats: { followers: "2.3M", engagement: "5.1%", posts: 345 },
  },
  {
    id: "11",
    name: "Nadir",
    category: "Gaming",
    rating: 4.6,
    socialStats: { followers: "1.5M", engagement: "4.7%", posts: 267 },
  },
  {
    id: "12",
    name: "Saloba Nur",
    category: "Fashion",
    rating: 5.0,
    socialStats: { followers: "4.2M", engagement: "6.5%", posts: 612 },
  },
];
