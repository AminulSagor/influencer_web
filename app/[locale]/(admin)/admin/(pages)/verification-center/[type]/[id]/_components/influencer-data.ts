const influencerData = {
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
};
