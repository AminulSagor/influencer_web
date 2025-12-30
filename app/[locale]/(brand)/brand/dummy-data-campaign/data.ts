import { CampaignDetails } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/types";

export const campaignMocksData: CampaignDetails[] = [
      {
    id: "cmp_a1b2c3",
    title: "Winter Wellness Campaign",
    brand: { id: "br_wellnest", name: "WellNest", logoUrl: "/avatar/avatar.png" },

    tabStatus: "Active",
    stage: "Promoting",

    platforms: ["instagram", "tiktok"],

    deadline: {
      date: "2026-01-05T00:00:00.000Z",
      daysRemainingLabel: "6 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 25000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 3750 },
      totalCost: { currency: "BDT", amount: 28750 },
      paidAmount: { currency: "BDT", amount: 28750 },
      dueAmount: { currency: "BDT", amount: 0 },
      statusLabel: "PAID",
    },

    rating: { canRate: false, averageStars: 4.7 },

    progressStepper: {
      currentStage: "Promoting",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Campaign Request Sent" },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: true, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: true, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_well_pack",
        title: "Product Pack Shots",
        fileType: "ZIP",
        sizeLabel: "6.1 MB",
        downloadUrl: "https://cdn.example.com/assets/wellnest/packshots.zip",
      },
      {
        id: "asset_well_brandbook",
        title: "Brand Book",
        fileType: "PDF",
        sizeLabel: "1.1 MB",
        downloadUrl: "https://cdn.example.com/assets/wellnest/brandbook.pdf",
      },
    ],

    brief: {
      campaignGoals:
        "Drive awareness for our winter vitamins and immune support lineup. Encourage daily habit content.",
      productOrServiceDetails:
        "Vitamins + immunity gummies with natural flavors and sugar-free option.",
      contentRequirements: [
        "1 Instagram Reel (20–40 sec)",
        "2 Stories with Link Sticker",
        "1 TikTok (15–30 sec)",
      ],
      dos: [
        "Use cozy winter vibe",
        "Show product + how you take it",
        "Mention benefit within first 3 seconds",
        "Use the campaign hashtag",
      ],
      donts: ["No medical claims", "No competitor mention", "Avoid misleading before/after"],
    },

    terms: {
      reportingRequirements: [
        "Share analytics screenshots 5 days after posting (Reach, Views, Engagement).",
        "Tag official brand profile and add hashtag.",
      ],
      usageRights: ["Brand can repost organically with attribution."],
      notes: ["Keep captions short and friendly."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_maria",
          name: "Maria Khan",
          avatarUrl: "/avatar/avatar.png",
          handle: "@mariakhan",
        },
        progress: { completedCount: 1, totalCount: 3, percentCompleted: 33.3 },
        milestones: [
          {
            id: "ms_well_reel",
            title: "Instagram Reel",
            dayLabel: "DAY 1",
            dueDate: "2025-12-31T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["1 Reel (20–40 sec)"],
            milestoneTargets: [{ key: "views", label: "Views", current: 120000, target: 100000 }],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_ms_well_reel",
              description: "Reel posted with product routine + CTA.",
              platformLinks: [{ platform: "instagram", url: "https://instagram.com/reel/111" }],
              proofs: [
                {
                  id: "proof_wr_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/wellnest/reel.png",
                  previewUrl: "https://cdn.example.com/proofs/wellnest/reel_thumb.png",
                  label: "Reel Screenshot",
                },
              ],
              submittedAt: "2025-12-31T10:10:00.000Z",
              updatedAt: "2025-12-31T10:20:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                { key: "views", label: "Views", current: 120000, target: 100000 },
                { key: "likes", label: "Likes", current: 8900, target: 7000 },
                { key: "shares", label: "Shares", current: 1200, target: 900 },
              ],
              averagePerformancePercent: 89.5,
            },
            review: {
              status: "Completed",
              message: "Approved.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-31T12:00:00.000Z",
            },
          },
          {
            id: "ms_well_tiktok",
            title: "TikTok Post",
            dayLabel: "DAY 2",
            dueDate: "2026-01-02T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 TikTok (15–30 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
          {
            id: "ms_well_report",
            title: "Analytics Submission",
            dayLabel: "DAY 3",
            dueDate: "2026-01-05T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["Upload analytics screenshots"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_maria",
    expandedMilestoneId: "ms_well_reel",
  },

  {
    id: "cmp_d4e5f6",
    title: "Gadget Launch Campaign",
    brand: { id: "br_techio", name: "Techio", logoUrl: "/avatar/avatar.png" },

    tabStatus: "Pending",
    stage: "Quoted",

    platforms: ["youtube", "instagram"],

    deadline: {
      date: "2026-01-12T00:00:00.000Z",
      daysRemainingLabel: "13 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 60000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 9000 },
      totalCost: { currency: "BDT", amount: 69000 },
      paidAmount: { currency: "BDT", amount: 0 },
      dueAmount: { currency: "BDT", amount: 69000 },
      statusLabel: "PENDING",
    },

    rating: { canRate: false, averageStars: undefined },

    progressStepper: {
      currentStage: "Quoted",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Campaign Request Sent" },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: false, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: false, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_tech_specs",
        title: "Product Specs Sheet",
        fileType: "PDF",
        sizeLabel: "420 KB",
        downloadUrl: "https://cdn.example.com/assets/techio/specs.pdf",
      },
      {
        id: "asset_tech_broll",
        title: "B-Roll Footage",
        fileType: "MP4",
        sizeLabel: "220 MB",
        downloadUrl: "https://cdn.example.com/assets/techio/broll.mp4",
      },
    ],

    brief: {
      campaignGoals:
        "Launch our new earbuds: highlight battery life, ANC, and comfort. Drive pre-orders.",
      productOrServiceDetails:
        "Wireless ANC earbuds with 35h battery, fast charge, and premium mic.",
      contentRequirements: [
        "1 YouTube Review (4–6 min)",
        "1 Instagram Reel (20–30 sec)",
      ],
      dos: [
        "Show unboxing + real usage",
        "Mention 35h battery + ANC",
        "Add pre-order link",
      ],
      donts: ["No false comparisons", "No pricing leaks if not provided"],
    },

    terms: {
      reportingRequirements: ["Provide YouTube analytics after 7 days."],
      usageRights: ["Brand may repost short clips up to 15 seconds with attribution."],
      notes: ["Use provided B-roll as overlay only."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_arif",
          name: "Arif Hasan",
          avatarUrl: "/avatar/avatar.png",
          handle: "@ariftech",
        },
        progress: { completedCount: 0, totalCount: 2, percentCompleted: 0 },
        milestones: [
          {
            id: "ms_tech_script",
            title: "Script / Outline Approval",
            dayLabel: "DAY 1",
            dueDate: "2026-01-03T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["Upload outline in doc or text"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
          {
            id: "ms_tech_video",
            title: "YouTube Review Upload",
            dayLabel: "DAY 2",
            dueDate: "2026-01-12T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 YouTube Review (4–6 min)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_arif",
    expandedMilestoneId: "ms_tech_script",
  },

  {
    id: "cmp_aa7788",
    title: "Restaurant Grand Opening",
    brand: { id: "br_spicebay", name: "SpiceBay", logoUrl: "/avatar/avatar.png" },

    tabStatus: "Active",
    stage: "Paid",

    platforms: ["facebook", "instagram"],

    deadline: {
      date: "2026-01-02T00:00:00.000Z",
      daysRemainingLabel: "3 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 12000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 1800 },
      totalCost: { currency: "BDT", amount: 13800 },
      paidAmount: { currency: "BDT", amount: 6900 },
      dueAmount: { currency: "BDT", amount: 6900 },
      statusLabel: "PARTIAL",
    },

    rating: { canRate: true, averageStars: undefined },

    progressStepper: {
      currentStage: "Paid",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Campaign Request Sent" },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: true, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: false, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_spice_menu",
        title: "Menu Photos",
        fileType: "ZIP",
        sizeLabel: "9.8 MB",
        downloadUrl: "https://cdn.example.com/assets/spicebay/menu-photos.zip",
      },
      {
        id: "asset_spice_offer",
        title: "Opening Offer Card",
        fileType: "PNG",
        sizeLabel: "180 KB",
        downloadUrl: "https://cdn.example.com/assets/spicebay/offer.png",
      },
    ],

    brief: {
      campaignGoals: "Drive footfall and reservations for the opening week.",
      productOrServiceDetails:
        "New seafood + grill restaurant with family seating and live BBQ corner.",
      contentRequirements: ["1 Instagram Reel", "1 Facebook Post", "3 Stories"],
      dos: ["Show ambience + signature dishes", "Mention offer and location pin"],
      donts: ["No fake discount claims", "No competitor comparisons"],
    },

    terms: {
      reportingRequirements: ["Share reach + engagement screenshots after 48 hours."],
      usageRights: ["Brand may repost your content with attribution."],
      notes: ["Use location tag and reservation number."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_rina",
          name: "Rina Akter",
          avatarUrl: "/avatar/avatar.png",
          handle: "@rinareviews",
        },
        progress: { completedCount: 1, totalCount: 2, percentCompleted: 50 },
        milestones: [
          {
            id: "ms_spice_visit",
            title: "Restaurant Visit + Reel",
            dayLabel: "DAY 1",
            dueDate: "2025-12-31T00:00:00.000Z",
            status: "InReview",
            contentRequirements: ["1 Reel + 3 Stories"],
            milestoneTargets: [
              { key: "views", label: "Views", current: 18000, target: 25000 },
            ],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_ms_spice_visit",
              description: "Reel posted with location and offer details.",
              platformLinks: [
                { platform: "instagram", url: "https://instagram.com/reel/spice1" },
                { platform: "facebook", url: "https://facebook.com/post/spice1" },
              ],
              proofs: [
                {
                  id: "proof_sp_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/spicebay/1.png",
                  previewUrl: "https://cdn.example.com/proofs/spicebay/1_thumb.png",
                  label: "Reel Screenshot",
                },
              ],
              submittedAt: "2025-12-31T19:30:00.000Z",
              updatedAt: "2025-12-31T19:40:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                { key: "views", label: "Views", current: 18000, target: 25000 },
                { key: "likes", label: "Likes", current: 2100, target: 2200 },
              ],
              averagePerformancePercent: 73.2,
            },
            review: {
              status: "InReview",
              message: "Checking compliance with offer text.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-31T20:10:00.000Z",
            },
          },
          {
            id: "ms_spice_report",
            title: "Analytics Screenshot",
            dayLabel: "DAY 2",
            dueDate: "2026-01-02T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["Upload analytics screenshots"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_rina",
    expandedMilestoneId: "ms_spice_visit",
  },

  {
    id: "cmp_bb9900",
    title: "Fitness 14-Day Challenge",
    brand: { id: "br_fitfuel", name: "FitFuel", logoUrl: "/avatar/avatar.png" },

    tabStatus: "Active",
    stage: "Promoting",

    platforms: ["instagram", "youtube"],

    deadline: {
      date: "2026-01-20T00:00:00.000Z",
      daysRemainingLabel: "21 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 40000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 6000 },
      totalCost: { currency: "BDT", amount: 46000 },
      paidAmount: { currency: "BDT", amount: 46000 },
      dueAmount: { currency: "BDT", amount: 0 },
      statusLabel: "PAID",
    },

    rating: { canRate: false, averageStars: 4.2 },

    progressStepper: {
      currentStage: "Promoting",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Campaign Request Sent" },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: true, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: true, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_fit_brand",
        title: "Brand Guidelines",
        fileType: "PDF",
        sizeLabel: "980 KB",
        downloadUrl: "https://cdn.example.com/assets/fitfuel/guidelines.pdf",
      },
      {
        id: "asset_fit_music",
        title: "Licensed Track Pack",
        fileType: "ZIP",
        sizeLabel: "12 MB",
        downloadUrl: "https://cdn.example.com/assets/fitfuel/music-pack.zip",
      },
    ],

    brief: {
      campaignGoals: "Get signups for the 14-day challenge and boost app installs.",
      productOrServiceDetails: "Fitness app with guided workouts + meal plan suggestions.",
      contentRequirements: [
        "2 Instagram Reels (before/after progress format)",
        "1 YouTube Short (30–45 sec)",
        "4 Stories with link sticker across 2 weeks",
      ],
      dos: ["Show real routine clips", "Use countdown sticker for challenge start"],
      donts: ["No unrealistic body promises", "No unsafe workout advice"],
    },

    terms: {
      reportingRequirements: ["Provide weekly analytics (Week 1 & Week 2)."],
      usageRights: ["Brand may repost content for 30 days with attribution."],
      notes: ["Use provided UTM link only."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_nadim",
          name: "Nadim Rahman",
          avatarUrl: "/avatar/avatar.png",
          handle: "@nadimfit",
        },
        progress: { completedCount: 1, totalCount: 3, percentCompleted: 33.3 },
        milestones: [
          {
            id: "ms_fit_reel1",
            title: "Reel #1 Upload",
            dayLabel: "DAY 1",
            dueDate: "2026-01-03T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["1 Reel (20–30 sec)"],
            milestoneTargets: [{ key: "views", label: "Views", current: 95000, target: 80000 }],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_ms_fit_reel1",
              description: "Workout montage + challenge CTA.",
              platformLinks: [{ platform: "instagram", url: "https://instagram.com/reel/fit1" }],
              proofs: [
                {
                  id: "proof_fit_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/fitfuel/1.png",
                  previewUrl: "https://cdn.example.com/proofs/fitfuel/1_thumb.png",
                  label: "Reel Screenshot",
                },
              ],
              submittedAt: "2026-01-03T09:05:00.000Z",
              updatedAt: "2026-01-03T09:08:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                { key: "views", label: "Views", current: 95000, target: 80000 },
                { key: "likes", label: "Likes", current: 6200, target: 5000 },
              ],
              averagePerformancePercent: 86.3,
            },
            review: {
              status: "Completed",
              message: "Approved.",
              reviewedBy: "Admin",
              reviewedAt: "2026-01-03T10:00:00.000Z",
            },
          },
          {
            id: "ms_fit_short",
            title: "YouTube Short Upload",
            dayLabel: "DAY 2",
            dueDate: "2026-01-06T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 YouTube Short (30–45 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
          {
            id: "ms_fit_reel2",
            title: "Reel #2 Upload",
            dayLabel: "DAY 10",
            dueDate: "2026-01-14T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 Reel (20–30 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_nadim",
    expandedMilestoneId: "ms_fit_reel1",
  },

  {
    id: "cmp_cc1122",
    title: "Travel Vlog Sponsorship",
    brand: { id: "br_tripmate", name: "TripMate", logoUrl: "/avatar/avatar.png" },

    tabStatus: "Active",
    stage: "Paid",

    platforms: ["youtube", "tiktok", "instagram"],

    deadline: {
      date: "2026-01-18T00:00:00.000Z",
      daysRemainingLabel: "19 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 75000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 11250 },
      totalCost: { currency: "BDT", amount: 86250 },
      paidAmount: { currency: "BDT", amount: 43125 },
      dueAmount: { currency: "BDT", amount: 43125 },
      statusLabel: "PARTIAL",
    },

    rating: { canRate: true, averageStars: undefined },

    progressStepper: {
      currentStage: "Paid",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Campaign Request Sent" },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: true, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: false, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_trip_script",
        title: "Key Talking Points",
        fileType: "PDF",
        sizeLabel: "260 KB",
        downloadUrl: "https://cdn.example.com/assets/tripmate/talking-points.pdf",
      },
      {
        id: "asset_trip_logos",
        title: "Logo Pack",
        fileType: "ZIP",
        sizeLabel: "1.9 MB",
        downloadUrl: "https://cdn.example.com/assets/tripmate/logos.zip",
      },
    ],

    brief: {
      campaignGoals:
        "Increase installs of TripMate and show how itinerary planning works in real travel.",
      productOrServiceDetails:
        "Travel planning app with itinerary builder, offline maps, and group trip sharing.",
      contentRequirements: [
        "1 YouTube Vlog Integration (6–10 min)",
        "1 TikTok (15–30 sec)",
        "2 Instagram Stories",
      ],
      dos: ["Show app screen recording", "Include download link in description"],
      donts: ["No unsafe travel advice", "No misleading pricing claims"],
    },

    terms: {
      reportingRequirements: ["YouTube analytics after 10 days.", "TikTok analytics after 5 days."],
      usageRights: ["Brand can repost TikTok/Shorts with attribution."],
      notes: ["Include disclosure hashtag."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_tanvir",
          name: "Tanvir Alam",
          avatarUrl: "/avatar/avatar.png",
          handle: "@tanvirtravels",
        },
        progress: { completedCount: 0, totalCount: 3, percentCompleted: 0 },
        milestones: [
          {
            id: "ms_trip_outline",
            title: "Outline Approval",
            dayLabel: "DAY 1",
            dueDate: "2026-01-02T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["Submit outline + integration timestamp plan"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
          {
            id: "ms_trip_vlog",
            title: "YouTube Vlog Upload",
            dayLabel: "DAY 12",
            dueDate: "2026-01-18T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 Vlog (6–10 min)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
          {
            id: "ms_trip_short",
            title: "TikTok Upload",
            dayLabel: "DAY 13",
            dueDate: "2026-01-19T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 TikTok (15–30 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_tanvir",
    expandedMilestoneId: "ms_trip_outline",
  },

  {
    id: "cmp_dd3344",
    title: "EdTech App Awareness",
    brand: { id: "br_learnly", name: "Learnly", logoUrl: "/avatar/avatar.png" },

    tabStatus: "Completed",
    stage: "Completed",

    platforms: ["instagram", "facebook"],

    deadline: {
      date: "2025-12-10T00:00:00.000Z",
      daysRemainingLabel: "Completed",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 22000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 3300 },
      totalCost: { currency: "BDT", amount: 25300 },
      paidAmount: { currency: "BDT", amount: 25300 },
      dueAmount: { currency: "BDT", amount: 0 },
      statusLabel: "PAID",
    },

    rating: { canRate: false, averageStars: 4.9 },

    progressStepper: {
      currentStage: "Completed",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Campaign Request Sent" },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: true, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: true, doneLabel: "Content Live" },
        { stage: "Completed", isDone: true, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_learn_appshots",
        title: "App Screenshots",
        fileType: "ZIP",
        sizeLabel: "4.2 MB",
        downloadUrl: "https://cdn.example.com/assets/learnly/screenshots.zip",
      },
    ],

    brief: {
      campaignGoals: "Increase app installs for exam prep learners.",
      productOrServiceDetails: "Practice tests, short lessons, daily streaks.",
      contentRequirements: ["1 Carousel Post", "2 Stories with link sticker"],
      dos: ["Show app flow in stories", "Highlight free trial"],
      donts: ["No guaranteed result claims"],
    },

    terms: {
      reportingRequirements: ["Provide reach + link clicks after 72 hours."],
      usageRights: ["Brand may use content for organic repost."],
      notes: ["Keep disclosures visible."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_nusrat",
          name: "Nusrat Jahan",
          avatarUrl: "/avatar/avatar.png",
          handle: "@studywithnusrat",
        },
        progress: { completedCount: 2, totalCount: 2, percentCompleted: 100 },
        milestones: [
          {
            id: "ms_learn_post",
            title: "Carousel Post",
            dayLabel: "DAY 1",
            dueDate: "2025-12-06T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["1 Carousel Post"],
            milestoneTargets: [{ key: "reach", label: "Reach", current: 160000, target: 120000 }],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_ms_learn_post",
              description: "Posted carousel explaining app features + CTA.",
              platformLinks: [{ platform: "instagram", url: "https://instagram.com/p/learn1" }],
              proofs: [
                {
                  id: "proof_learn_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/learnly/1.png",
                  previewUrl: "https://cdn.example.com/proofs/learnly/1_thumb.png",
                  label: "Post Screenshot",
                },
              ],
              submittedAt: "2025-12-06T14:00:00.000Z",
              updatedAt: "2025-12-06T14:10:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                { key: "reach", label: "Reach", current: 160000, target: 120000 },
                { key: "saves", label: "Saves", current: 7200, target: 5000 },
              ],
              averagePerformancePercent: 92.1,
            },
            review: {
              status: "Completed",
              message: "Great quality. Approved.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-06T15:00:00.000Z",
            },
          },
          {
            id: "ms_learn_report",
            title: "Analytics Upload",
            dayLabel: "DAY 3",
            dueDate: "2025-12-09T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["Upload analytics screenshots"],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_nusrat",
    expandedMilestoneId: "ms_learn_post",
  },

  {
    id: "cmp_ee5566",
    title: "Mobile Game Season Pass Promo",
    brand: { id: "br_arcadia", name: "Arcadia Games", logoUrl: "/avatar/avatar.png" },

    tabStatus: "Active",
    stage: "Promoting",

    platforms: ["youtube", "tiktok"],

    deadline: {
      date: "2026-01-09T00:00:00.000Z",
      daysRemainingLabel: "10 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 50000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 7500 },
      totalCost: { currency: "BDT", amount: 57500 },
      paidAmount: { currency: "BDT", amount: 57500 },
      dueAmount: { currency: "BDT", amount: 0 },
      statusLabel: "PAID",
    },

    rating: { canRate: false, averageStars: 4.4 },

    progressStepper: {
      currentStage: "Promoting",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Campaign Request Sent" },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: true, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: true, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_arcadia_creatives",
        title: "Season Pass Creatives",
        fileType: "ZIP",
        sizeLabel: "18 MB",
        downloadUrl: "https://cdn.example.com/assets/arcadia/creatives.zip",
      },
      {
        id: "asset_arcadia_patch",
        title: "Patch Notes",
        fileType: "PDF",
        sizeLabel: "300 KB",
        downloadUrl: "https://cdn.example.com/assets/arcadia/patch-notes.pdf",
      },
    ],

    brief: {
      campaignGoals:
        "Promote the new season pass and highlight top 3 rewards. Drive installs + pass purchases.",
      productOrServiceDetails: "Mobile action game with weekly events and battle pass.",
      contentRequirements: ["1 TikTok gameplay clip", "1 YouTube Short"],
      dos: ["Show reward screen", "Include install link + season code"],
      donts: ["No cheats/mods", "No profanity", "No misleading reward odds"],
    },

    terms: {
      reportingRequirements: ["Share views + link clicks after 5 days."],
      usageRights: ["Brand can repost clips with attribution for 60 days."],
      notes: ["Use #ad and disclosure text."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_razi",
          name: "Razi Ahmed",
          avatarUrl: "/avatar/avatar.png",
          handle: "@razigaming",
        },
        progress: { completedCount: 1, totalCount: 2, percentCompleted: 50 },
        milestones: [
          {
            id: "ms_game_tiktok",
            title: "TikTok Gameplay Upload",
            dayLabel: "DAY 1",
            dueDate: "2026-01-02T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["1 TikTok gameplay clip (15–25 sec)"],
            milestoneTargets: [{ key: "views", label: "Views", current: 310000, target: 250000 }],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_ms_game_tiktok",
              description: "Posted gameplay highlights + season pass CTA.",
              platformLinks: [{ platform: "tiktok", url: "https://tiktok.com/@razi/video/888" }],
              proofs: [
                {
                  id: "proof_game_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/arcadia/1.png",
                  previewUrl: "https://cdn.example.com/proofs/arcadia/1_thumb.png",
                  label: "TikTok Screenshot",
                },
              ],
              submittedAt: "2026-01-02T13:30:00.000Z",
              updatedAt: "2026-01-02T13:40:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                { key: "views", label: "Views", current: 310000, target: 250000 },
                { key: "likes", label: "Likes", current: 42000, target: 35000 },
              ],
              averagePerformancePercent: 90.0,
            },
            review: {
              status: "Completed",
              message: "Approved.",
              reviewedBy: "Admin",
              reviewedAt: "2026-01-02T15:00:00.000Z",
            },
          },
          {
            id: "ms_game_short",
            title: "YouTube Short Upload",
            dayLabel: "DAY 2",
            dueDate: "2026-01-05T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 YouTube Short (20–35 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_razi",
    expandedMilestoneId: "ms_game_tiktok",
  },

  {
    id: "cmp_ff7788",
    title: "Charity Fundraiser Awareness",
    brand: { id: "br_helpinghands", name: "HelpingHands", logoUrl: "/avatar/avatar.png" },

    tabStatus: "Active",
    stage: "Submitted",

    platforms: ["facebook", "instagram", "linkedin"],

    deadline: {
      date: "2026-01-07T00:00:00.000Z",
      daysRemainingLabel: "8 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 0 },
      vatPercent: 0,
      vatAmount: { currency: "BDT", amount: 0 },
      totalCost: { currency: "BDT", amount: 0 },
      paidAmount: { currency: "BDT", amount: 0 },
      dueAmount: { currency: "BDT", amount: 0 },
      statusLabel: "N/A",
    },

    rating: { canRate: false, averageStars: undefined },

    progressStepper: {
      currentStage: "Submitted",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Campaign Request Sent" },
        { stage: "Quoted", isDone: false, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: false, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: false, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_hh_toolkit",
        title: "Fundraiser Toolkit",
        fileType: "PDF",
        sizeLabel: "650 KB",
        downloadUrl: "https://cdn.example.com/assets/helpinghands/toolkit.pdf",
      },
    ],

    brief: {
      campaignGoals: "Spread awareness and drive donations for winter relief program.",
      productOrServiceDetails: "Donation program providing blankets and meals.",
      contentRequirements: ["1 Facebook Post", "1 Instagram Post", "1 LinkedIn Post"],
      dos: ["Keep messaging respectful", "Include donation link and impact numbers"],
      donts: ["No graphic imagery", "No guilt-shaming language"],
    },

    terms: {
      reportingRequirements: ["Share post links after publishing."],
      usageRights: ["Org may repost with attribution."],
      notes: ["No paid boosting unless explicitly approved."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_sadia",
          name: "Sadia Noor",
          avatarUrl: "/avatar/avatar.png",
          handle: "@sadianoor",
        },
        progress: { completedCount: 0, totalCount: 1, percentCompleted: 0 },
        milestones: [
          {
            id: "ms_hh_post",
            title: "Multi-Platform Posting",
            dayLabel: "DAY 1",
            dueDate: "2026-01-07T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["Facebook + Instagram + LinkedIn post"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_sadia",
    expandedMilestoneId: "ms_hh_post",
  },

  {
    id: "cmp_112233",
    title: "Beauty Bundle Flash Sale",
    brand: { id: "br_glowup", name: "GlowUp", logoUrl: "/avatar/avatar.png" },

    tabStatus: "Cancelled",
    stage: "Cancelled",

    platforms: ["instagram"],

    deadline: {
      date: "2025-12-22T00:00:00.000Z",
      daysRemainingLabel: "Cancelled",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 15000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 2250 },
      totalCost: { currency: "BDT", amount: 17250 },
      paidAmount: { currency: "BDT", amount: 0 },
      dueAmount: { currency: "BDT", amount: 0 },
      statusLabel: "CANCELLED",
    },

    rating: { canRate: false, averageStars: undefined },

    progressStepper: {
      currentStage: "Cancelled",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Campaign Request Sent" },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: false, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: false, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [],

    brief: {
      campaignGoals: "Flash sale awareness for a limited bundle.",
      productOrServiceDetails: "Skincare bundle including cleanser + serum + moisturizer.",
      contentRequirements: ["1 Reel + 3 Stories"],
      dos: ["Mention valid sale dates", "Show bundle items clearly"],
      donts: ["No fake scarcity", "No unverified claims"],
    },

    terms: {
      reportingRequirements: [],
      usageRights: [],
      notes: ["Campaign cancelled by brand due to stock constraints."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_emi",
          name: "Emi Chowdhury",
          avatarUrl: "/avatar/avatar.png",
          handle: "@emibeauty",
        },
        progress: { completedCount: 0, totalCount: 0, percentCompleted: 0 },
        milestones: [],
      },
    ],

    selectedInfluencerId: "inf_emi",
    expandedMilestoneId: undefined,
  },
    
  {
    id: "cmp_9f3d2c",
    title: "Summer Fashion Campaign",
    brand: {
      id: "br_styleco",
      name: "StyleCo.",
      logoUrl: "/avatar/avatar.png",
    },

    tabStatus: "Active",
    stage: "Paid",

    platforms: ["instagram", "youtube", "tiktok"],

    deadline: {
      date: "2025-12-16T00:00:00.000Z",
      daysRemainingLabel: "4 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 18000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 2700 },
      totalCost: { currency: "BDT", amount: 20700 },
      paidAmount: { currency: "BDT", amount: 13500 },
      dueAmount: { currency: "BDT", amount: 7200 },
      statusLabel: "PARTIAL",
    },

    rating: {
      canRate: true,
      averageStars: undefined,
    },

    progressStepper: {
      currentStage: "Paid",
      stages: [
        {
          stage: "Submitted",
          isDone: true,
          doneLabel: "Campaign Request Sent",
        },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: true, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: false, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_logo_pack",
        title: "Brand Logo Pack",
        fileType: "ZIP",
        sizeLabel: "2.4 MB",
        downloadUrl: "https://cdn.example.com/assets/styleco/logo-pack.zip",
      },
      {
        id: "asset_demo_video",
        title: "Product Demo Video",
        fileType: "MP4",
        sizeLabel: "80 MB",
        downloadUrl: "https://cdn.example.com/assets/styleco/product-demo.mp4",
      },
      {
        id: "asset_guidelines",
        title: "Brand Guidelines",
        fileType: "PDF",
        sizeLabel: "750 KB",
        downloadUrl:
          "https://cdn.example.com/assets/styleco/brand-guidelines.pdf",
      },
    ],

    brief: {
      campaignGoals:
        "Promote our new summer skincare line to Gen Z and Millennial audiences. Focus on natural ingredients and sustainable packaging.",
      productOrServiceDetails:
        "New Summer Skincare line with natural ingredients, lightweight formula, and eco-friendly packaging.",
      contentRequirements: [
        "Minimum 2 Instagram Feed Posts",
        "3 Stories with Swipe Up Link",
        "1 YouTube Short (30–60 seconds)",
        "1 TikTok Video Featuring Trending Sounds",
      ],
      dos: [
        "Use natural lighting",
        "Show the product clearly",
        "Mention key benefits in the first 3 seconds",
        "Include brand tag and campaign hashtag",
      ],
      donts: [
        "No misleading claims",
        "No competitor branding",
        "Avoid excessive filters",
        "No offensive language",
      ],
    },

    terms: {
      reportingRequirements: [
        "Provide analytics screenshots 7 days post-publication (Reach, Engagement, Link-Through Rates).",
        "Tag the official brand account and use the campaign hashtag.",
      ],
      usageRights: [
        "Brand may repost content on official channels with proper attribution.",
        "No paid boosting by influencer without written approval.",
      ],
      notes: ["Late submissions may affect final payout schedule."],
    },

    influencerCampaigns: [
      // ---------------- Influencer #1 ----------------
      {
        influencer: {
          id: "inf_hania",
          name: "Hania Amir",
          avatarUrl: "/avatar/avatar.png",
          handle: "@hania",
        },

        progress: {
          completedCount: 2,
          totalCount: 4,
          percentCompleted: 50,
        },

        milestones: [
          {
            id: "ms_initial_content",
            title: "Initial Content Creation",
            dayLabel: "DAY 1",
            dueDate: "2025-12-12T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["2 Instagram Posts + 3 Stories"],
            milestoneTargets: [
              { key: "reach", label: "Reach", current: 320000, target: 300000 },
              { key: "likes", label: "Likes", current: 52000, target: 50000 },
            ],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_ms_initial_content",
              description: "Feed posts + stories uploaded as per brief.",
              platformLinks: [
                {
                  platform: "instagram",
                  url: "https://instagram.com/p/abc123",
                },
                {
                  platform: "instagram",
                  url: "https://instagram.com/stories/abc123",
                },
              ],
              proofs: [
                {
                  id: "proof_ic_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/initial/1.png",
                  previewUrl:
                    "https://cdn.example.com/proofs/initial/1_thumb.png",
                  label: "Post Screenshot",
                },
                {
                  id: "proof_ic_2",
                  type: "image",
                  url: "https://cdn.example.com/proofs/initial/2.png",
                  previewUrl:
                    "https://cdn.example.com/proofs/initial/2_thumb.png",
                  label: "Story Screenshot",
                },
              ],
              submittedAt: "2025-12-12T10:15:00.000Z",
              updatedAt: "2025-12-12T10:20:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                {
                  key: "reach",
                  label: "Reach",
                  current: 320000,
                  target: 300000,
                },
                { key: "likes", label: "Likes", current: 52000, target: 50000 },
                {
                  key: "comments",
                  label: "Comments",
                  current: 4100,
                  target: 3000,
                },
                { key: "shares", label: "Shares", current: 2200, target: 2000 },
              ],
              averagePerformancePercent: 92.8,
            },
            review: {
              status: "Completed",
              message: "Approved. Content meets requirements.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-12T12:00:00.000Z",
            },
          },

          {
            id: "ms_youtube_short",
            title: "YouTube Video Upload",
            dayLabel: "DAY 2",
            dueDate: "2025-12-13T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["1 Sponsored Video (60 sec)"],
            milestoneTargets: [
              { key: "views", label: "Views", current: 180000, target: 150000 },
              {
                key: "comments",
                label: "Comments",
                current: 2800,
                target: 2000,
              },
            ],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_ms_youtube_short",
              description: "YouTube short posted with brand mention and CTA.",
              platformLinks: [
                {
                  platform: "youtube",
                  url: "https://youtube.com/shorts/xyz999",
                },
              ],
              proofs: [
                {
                  id: "proof_yt_1",
                  type: "video",
                  url: "https://cdn.example.com/proofs/youtube/short.mp4",
                  previewUrl:
                    "https://cdn.example.com/proofs/youtube/short_thumb.png",
                  label: "Uploaded Video File",
                },
                {
                  id: "proof_yt_2",
                  type: "image",
                  url: "https://cdn.example.com/proofs/youtube/analytics.png",
                  previewUrl:
                    "https://cdn.example.com/proofs/youtube/analytics_thumb.png",
                  label: "Analytics Screenshot",
                },
              ],
              submittedAt: "2025-12-13T09:00:00.000Z",
              updatedAt: "2025-12-13T09:10:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                {
                  key: "views",
                  label: "Views",
                  current: 180000,
                  target: 150000,
                },
                { key: "likes", label: "Likes", current: 34000, target: 30000 },
                {
                  key: "comments",
                  label: "Comments",
                  current: 2800,
                  target: 2000,
                },
                { key: "shares", label: "Shares", current: 1900, target: 1500 },
              ],
              averagePerformancePercent: 88.5,
            },
            review: {
              status: "Completed",
              message: "Approved.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-13T12:10:00.000Z",
            },
          },

          {
            id: "ms_tiktok_campaign",
            title: "TikTok Campaign",
            dayLabel: "DAY 3",
            dueDate: "2025-12-15T00:00:00.000Z",
            status: "InReview",
            contentRequirements: ["1 Sponsored Video (60 sec)"],
            milestoneTargets: [
              { key: "reach", label: "Reach", current: 200000, target: 300000 },
              { key: "views", label: "Views", current: 250000, target: 250000 },
              {
                key: "reactions",
                label: "Reactions",
                current: 300000,
                target: 300000,
              },
              {
                key: "comments",
                label: "Comments",
                current: 3000,
                target: 3000,
              },
            ],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_ms_tiktok_campaign",
              description:
                "Posted TikTok with trending audio + product showcase.",
              platformLinks: [
                {
                  platform: "tiktok",
                  url: "https://tiktok.com/@hania/video/777",
                },
                // your screenshot shows fb link, so included too:
                {
                  platform: "facebook",
                  url: "https://facebook.com/hania/live",
                },
              ],
              proofs: [
                {
                  id: "proof_tt_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/tiktok/1.png",
                  previewUrl:
                    "https://cdn.example.com/proofs/tiktok/1_thumb.png",
                  label: "Proof 1",
                },
                {
                  id: "proof_tt_2",
                  type: "image",
                  url: "https://cdn.example.com/proofs/tiktok/2.png",
                  previewUrl:
                    "https://cdn.example.com/proofs/tiktok/2_thumb.png",
                  label: "Proof 2",
                },
                {
                  id: "proof_tt_3",
                  type: "image",
                  url: "https://cdn.example.com/proofs/tiktok/3.png",
                  previewUrl:
                    "https://cdn.example.com/proofs/tiktok/3_thumb.png",
                  label: "Proof 3",
                },
              ],
              submittedAt: "2025-12-15T09:30:00.000Z",
              updatedAt: "2025-12-15T09:45:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                {
                  key: "reach",
                  label: "Reach",
                  current: 200000,
                  target: 300000,
                },
                { key: "likes", label: "Likes", current: 50000, target: 50000 },
                {
                  key: "views",
                  label: "Views",
                  current: 250000,
                  target: 250000,
                },
                {
                  key: "comments",
                  label: "Comments",
                  current: 3000,
                  target: 3000,
                },
              ],
              averagePerformancePercent: 65.4,
            },
            review: {
              status: "InReview",
              message: "Submission received. Under review.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-15T10:00:00.000Z",
            },
          },

          {
            id: "ms_final_report",
            title: "Final Report Submission",
            dayLabel: "DAY 4",
            dueDate: "2025-12-16T00:00:00.000Z",
            status: "Pending",
            contentRequirements: [
              "Upload final analytics screenshots + summary report",
            ],
            milestoneTargets: [
              { key: "shares", label: "Shares", current: 0, target: 2000 },
            ],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },

      // ---------------- Influencer #2 (light example) ----------------
      {
        influencer: {
          id: "inf_salman",
          name: "Salman Khan",
          avatarUrl: "/avatar/avatar.png",
          handle: "@salman",
        },

        progress: {
          completedCount: 0,
          totalCount: 3,
          percentCompleted: 0,
        },

        milestones: [
          {
            id: "ms2_initial",
            title: "Initial Content Creation",
            dayLabel: "DAY 1",
            dueDate: "2025-12-12T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["2 Instagram Posts + 3 Stories"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
          {
            id: "ms2_tiktok",
            title: "TikTok Campaign",
            dayLabel: "DAY 2",
            dueDate: "2025-12-15T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 Sponsored Video (60 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
          {
            id: "ms2_report",
            title: "Final Report Submission",
            dayLabel: "DAY 3",
            dueDate: "2025-12-16T00:00:00.000Z",
            status: "Pending",
            contentRequirements: [
              "Upload final analytics screenshots + summary report",
            ],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },

      // ---------------- Influencer #3 (empty example) ----------------
      {
        influencer: {
          id: "inf_john",
          name: "John Smith",
          avatarUrl: "/avatar/avatar.png",
          handle: "@johnsmith",
        },

        progress: {
          completedCount: 0,
          totalCount: 0,
          percentCompleted: 0,
        },

        milestones: [],
      },
    ],

    selectedInfluencerId: "inf_hania",
    expandedMilestoneId: "ms_tiktok_campaign",
  },

  // =========================================================
  // 1) Active + Promoting
  // =========================================================

  {
    id: "cmp_tech_001",
    title: "Tech Product Launch",
    brand: {
      id: "br_techguru",
      name: "TechGuru",
      logoUrl: "/avatar/avatar.png",
    },

    tabStatus: "Active",
    stage: "Promoting",

    platforms: ["instagram", "youtube", "tiktok"],

    deadline: {
      date: "2025-12-20T00:00:00.000Z",
      daysRemainingLabel: "8 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 18000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 2700 },
      totalCost: { currency: "BDT", amount: 20700 },
      paidAmount: { currency: "BDT", amount: 20700 },
      dueAmount: { currency: "BDT", amount: 0 },
      statusLabel: "PAID",
    },

    rating: { canRate: false },

    progressStepper: {
      currentStage: "Promoting",
      stages: [
        {
          stage: "Submitted",
          isDone: true,
          doneLabel: "Campaign Request Sent",
        },
        { stage: "Quoted", isDone: true, doneLabel: "Quote Provided" },
        { stage: "Paid", isDone: true, doneLabel: "Payment Processed" },
        { stage: "Promoting", isDone: true, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_tech_kit",
        title: "Launch Media Kit",
        fileType: "ZIP",
        sizeLabel: "6.1 MB",
        downloadUrl: "https://cdn.example.com/assets/techguru/media-kit.zip",
      },
      {
        id: "asset_tech_demo",
        title: "Demo Footage",
        fileType: "MP4",
        sizeLabel: "120 MB",
        downloadUrl: "https://cdn.example.com/assets/techguru/demo.mp4",
      },
      {
        id: "asset_tech_copy",
        title: "Key Messaging Doc",
        fileType: "DOCX",
        sizeLabel: "380 KB",
        downloadUrl:
          "https://cdn.example.com/assets/techguru/key-messaging.docx",
      },
    ],

    brief: {
      campaignGoals:
        "Build awareness for the new gadget launch, drive clicks to landing page, and collect early signups.",
      productOrServiceDetails:
        "Smart wearable gadget with 7-day battery, health tracking, and fast charging.",
      contentRequirements: [
        "1 TikTok Video (45–60 seconds)",
        "1 YouTube Short (30–60 seconds)",
        "2 Instagram Feed Posts",
        "3 Instagram Stories with link",
      ],
      dos: [
        "Show unboxing",
        "Mention battery + core feature",
        "Include CTA link",
      ],
      donts: [
        "No competitor comparisons",
        "No false claims",
        "Avoid shaky footage",
      ],
    },

    terms: {
      reportingRequirements: [
        "Submit analytics screenshots 7 days after posting (views, reach, engagement).",
        "Include #TechGuruLaunch and tag @TechGuru.",
      ],
      usageRights: ["Brand can repost content with credit."],
      notes: ["Use provided talking points for consistency."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_salman",
          name: "Salman Khan",
          avatarUrl: "/avatar/avatar.png",
          handle: "@salman",
        },
        progress: { completedCount: 1, totalCount: 3, percentCompleted: 33.33 },
        milestones: [
          {
            id: "ms_tg_ig_posts",
            title: "Instagram Launch Posts",
            dayLabel: "DAY 1",
            dueDate: "2025-12-14T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["2 Instagram Feed Posts"],
            milestoneTargets: [
              { key: "reach", label: "Reach", current: 310000, target: 250000 },
              { key: "likes", label: "Likes", current: 41000, target: 30000 },
            ],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_tg_ig_posts",
              description: "Two feed posts uploaded with CTA and hashtags.",
              platformLinks: [
                {
                  platform: "instagram",
                  url: "https://instagram.com/p/tech_111",
                },
                {
                  platform: "instagram",
                  url: "https://instagram.com/p/tech_112",
                },
              ],
              proofs: [
                {
                  id: "proof_tg_ig_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/tg/ig1.png",
                  previewUrl: "https://cdn.example.com/proofs/tg/ig1_thumb.png",
                  label: "Post 1",
                },
                {
                  id: "proof_tg_ig_2",
                  type: "image",
                  url: "https://cdn.example.com/proofs/tg/ig2.png",
                  previewUrl: "https://cdn.example.com/proofs/tg/ig2_thumb.png",
                  label: "Post 2",
                },
              ],
              submittedAt: "2025-12-14T10:10:00.000Z",
              updatedAt: "2025-12-14T10:25:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                {
                  key: "reach",
                  label: "Reach",
                  current: 310000,
                  target: 250000,
                },
                { key: "likes", label: "Likes", current: 41000, target: 30000 },
                {
                  key: "comments",
                  label: "Comments",
                  current: 2400,
                  target: 1500,
                },
                { key: "shares", label: "Shares", current: 1600, target: 1200 },
              ],
              averagePerformancePercent: 91.2,
            },
            review: {
              status: "Completed",
              message: "Approved. Strong engagement.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-14T12:00:00.000Z",
            },
          },
          {
            id: "ms_tg_tiktok",
            title: "TikTok Product Showcase",
            dayLabel: "DAY 2",
            dueDate: "2025-12-16T00:00:00.000Z",
            status: "InReview",
            contentRequirements: ["1 TikTok Video (45–60 sec)"],
            milestoneTargets: [
              { key: "views", label: "Views", current: 180000, target: 250000 },
              {
                key: "comments",
                label: "Comments",
                current: 1800,
                target: 2000,
              },
            ],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_tg_tiktok",
              description: "Posted with trending audio + feature highlights.",
              platformLinks: [
                {
                  platform: "tiktok",
                  url: "https://tiktok.com/@salman/video/9090",
                },
              ],
              proofs: [
                {
                  id: "proof_tg_tt_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/tg/tt1.png",
                  previewUrl: "https://cdn.example.com/proofs/tg/tt1_thumb.png",
                  label: "TikTok Proof",
                },
              ],
              submittedAt: "2025-12-16T09:20:00.000Z",
              updatedAt: "2025-12-16T09:30:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                {
                  key: "views",
                  label: "Views",
                  current: 180000,
                  target: 250000,
                },
                { key: "likes", label: "Likes", current: 33000, target: 40000 },
                {
                  key: "comments",
                  label: "Comments",
                  current: 1800,
                  target: 2000,
                },
                { key: "shares", label: "Shares", current: 1400, target: 1500 },
              ],
              averagePerformancePercent: 70.1,
            },
            review: {
              status: "InReview",
              message: "Received. Checking requirements and link placement.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-16T10:10:00.000Z",
            },
          },
          {
            id: "ms_tg_youtube_short",
            title: "YouTube Short Upload",
            dayLabel: "DAY 3",
            dueDate: "2025-12-18T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 YouTube Short (30–60 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_salman",
    expandedMilestoneId: "ms_tg_tiktok",
  },

  // =========================================================
  // 2) Budgeting & Quoting + Quoted
  // =========================================================
  {
    id: "cmp_fit_002",
    title: "Fitness Brand Partnership",
    brand: {
      id: "br_growbig",
      name: "GrowBig",
      logoUrl: "/avatar/avatar.png",
    },

    tabStatus: "BudgetingAndQuoting",
    stage: "Quoted",

    platforms: ["instagram", "tiktok"],

    deadline: {
      date: "2025-12-25T00:00:00.000Z",
      daysRemainingLabel: "13 Days Remaining",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 32000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 4800 },
      totalCost: { currency: "BDT", amount: 36800 },
      paidAmount: { currency: "BDT", amount: 0 },
      dueAmount: { currency: "BDT", amount: 36800 },
      statusLabel: "DUE",
    },

    rating: { canRate: false },

    progressStepper: {
      currentStage: "Quoted",
      stages: [
        {
          stage: "Submitted",
          isDone: true,
          doneLabel: "Campaign Request Sent",
        },
        { stage: "Quoted", isDone: true, doneLabel: "Quotation Received" },
        { stage: "Paid", isDone: false, doneLabel: "Awaiting Payment" },
        { stage: "Promoting", isDone: false, doneLabel: "Content Live" },
        { stage: "Completed", isDone: false, doneLabel: "Campaign Finished" },
      ],
    },

    contentAssets: [
      {
        id: "asset_fit_brandbook",
        title: "Brand Book",
        fileType: "PDF",
        sizeLabel: "1.1 MB",
        downloadUrl: "https://cdn.example.com/assets/growbig/brandbook.pdf",
      },
      {
        id: "asset_fit_product_shots",
        title: "Product Shots",
        fileType: "ZIP",
        sizeLabel: "18 MB",
        downloadUrl: "https://cdn.example.com/assets/growbig/product-shots.zip",
      },
    ],

    brief: {
      campaignGoals:
        "Promote fitness supplement bundle and drive sales via discount code.",
      productOrServiceDetails:
        "Protein + creatine bundle with 10% off code. Emphasis on routine and results timeline.",
      contentRequirements: [
        "1 Instagram Reel (30–45 seconds)",
        "2 Instagram Stories with code",
        "1 TikTok Video (30–45 seconds)",
      ],
      dos: [
        "Show routine",
        "Use discount code overlay",
        "Keep claims realistic",
      ],
      donts: [
        "No medical claims",
        "No before/after exaggeration",
        "No competitor mention",
      ],
    },

    terms: {
      reportingRequirements: [
        "Upload analytics screenshots after 7 days (reach, views, engagement).",
        "Must include discount code and tag @GrowBig.",
      ],
      usageRights: ["Brand may repost content with credit."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_hania",
          name: "Hania Amir",
          avatarUrl: "/avatar/avatar.png",
          handle: "@hania",
        },
        progress: { completedCount: 0, totalCount: 3, percentCompleted: 0 },
        milestones: [
          {
            id: "ms_fit_reel",
            title: "Instagram Reel",
            dayLabel: "DAY 1",
            dueDate: "2025-12-21T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 Instagram Reel (30–45 sec)"],
            milestoneTargets: [
              { key: "views", label: "Views", current: 0, target: 200000 },
              { key: "reach", label: "Reach", current: 0, target: 150000 },
            ],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
          {
            id: "ms_fit_stories",
            title: "Instagram Stories",
            dayLabel: "DAY 2",
            dueDate: "2025-12-22T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["2 Stories with discount code"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
          {
            id: "ms_fit_tiktok",
            title: "TikTok Video",
            dayLabel: "DAY 3",
            dueDate: "2025-12-23T00:00:00.000Z",
            status: "Pending",
            contentRequirements: ["1 TikTok Video (30–45 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_hania",
    expandedMilestoneId: "ms_fit_reel",
  },

  // =========================================================
  // 3) Completed + rating summary
  // =========================================================
  {
    id: "cmp_winter_003",
    title: "Winter Skincare Awareness",
    brand: {
      id: "br_glowcare",
      name: "GlowCare",
      logoUrl: "/avatar/avatar.png",
    },

    tabStatus: "Completed",
    stage: "Completed",

    platforms: ["instagram", "youtube"],

    deadline: {
      date: "2025-12-05T00:00:00.000Z",
      daysRemainingLabel: "Completed",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 11000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 1650 },
      totalCost: { currency: "BDT", amount: 12650 },
      paidAmount: { currency: "BDT", amount: 12650 },
      dueAmount: { currency: "BDT", amount: 0 },
      statusLabel: "PAID",
    },

    rating: {
      canRate: false,
      averageStars: 4.5,
    },

    progressStepper: {
      currentStage: "Completed",
      stages: [
        { stage: "Submitted", isDone: true },
        { stage: "Quoted", isDone: true },
        { stage: "Paid", isDone: true },
        { stage: "Promoting", isDone: true },
        { stage: "Completed", isDone: true },
      ],
    },

    contentAssets: [
      {
        id: "asset_winter_guidelines",
        title: "Campaign Guidelines",
        fileType: "PDF",
        sizeLabel: "540 KB",
        downloadUrl:
          "https://cdn.example.com/assets/glowcare/winter-guidelines.pdf",
      },
    ],

    brief: {
      campaignGoals:
        "Drive brand awareness and increase page follows for winter skincare range.",
      productOrServiceDetails:
        "Moisturizer + sunscreen combo optimized for dry season.",
      contentRequirements: ["1 YouTube Short", "1 Instagram Post", "2 Stories"],
      dos: [
        "Mention winter dryness problem",
        "Show texture on hand",
        "Use soft lighting",
      ],
      donts: ["No unrealistic claims", "Avoid competitor comparisons"],
    },

    terms: {
      reportingRequirements: ["Submit final analytics after 7 days."],
      usageRights: ["Brand can repost with credit."],
      notes: ["Campaign closed successfully."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_john",
          name: "John Smith",
          avatarUrl: "/avatar/avatar.png",
          handle: "@johnsmith",
        },
        progress: { completedCount: 3, totalCount: 3, percentCompleted: 100 },
        milestones: [
          {
            id: "ms_winter_ig_post",
            title: "Instagram Post",
            dayLabel: "DAY 1",
            dueDate: "2025-11-28T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["1 Instagram Feed Post"],
            milestoneTargets: [
              { key: "reach", label: "Reach", current: 210000, target: 180000 },
              { key: "likes", label: "Likes", current: 26000, target: 22000 },
            ],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_winter_ig_post",
              description: "Posted with brand tag and CTA.",
              platformLinks: [
                {
                  platform: "instagram",
                  url: "/avatar/avatar.png",
                },
              ],
              proofs: [
                {
                  id: "proof_winter_ig_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/winter/ig1.png",
                  previewUrl:
                    "https://cdn.example.com/proofs/winter/ig1_thumb.png",
                  label: "Post Screenshot",
                },
              ],
              submittedAt: "2025-11-28T09:00:00.000Z",
              updatedAt: "2025-11-28T09:15:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                {
                  key: "reach",
                  label: "Reach",
                  current: 210000,
                  target: 180000,
                },
                { key: "likes", label: "Likes", current: 26000, target: 22000 },
                {
                  key: "comments",
                  label: "Comments",
                  current: 1900,
                  target: 1500,
                },
                { key: "shares", label: "Shares", current: 1200, target: 900 },
              ],
              averagePerformancePercent: 89.4,
            },
            review: {
              status: "Completed",
              message: "Approved.",
              reviewedBy: "Admin",
              reviewedAt: "2025-11-28T11:00:00.000Z",
            },
          },
          {
            id: "ms_winter_stories",
            title: "Instagram Stories",
            dayLabel: "DAY 2",
            dueDate: "2025-11-29T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["2 Instagram Stories"],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_winter_stories",
              description: "Stories posted with link sticker.",
              platformLinks: [
                {
                  platform: "instagram",
                  url: "https://instagram.com/stories/winter_002",
                },
              ],
              proofs: [
                {
                  id: "proof_winter_story_1",
                  type: "image",
                  url: "https://cdn.example.com/proofs/winter/story1.png",
                  previewUrl:
                    "https://cdn.example.com/proofs/winter/story1_thumb.png",
                  label: "Story 1",
                },
                {
                  id: "proof_winter_story_2",
                  type: "image",
                  url: "https://cdn.example.com/proofs/winter/story2.png",
                  previewUrl:
                    "https://cdn.example.com/proofs/winter/story2_thumb.png",
                  label: "Story 2",
                },
              ],
              submittedAt: "2025-11-29T08:10:00.000Z",
              updatedAt: "2025-11-29T08:20:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                {
                  key: "views",
                  label: "Views",
                  current: 140000,
                  target: 100000,
                },
                {
                  key: "reactions",
                  label: "Reactions",
                  current: 9000,
                  target: 7000,
                },
                { key: "shares", label: "Shares", current: 1100, target: 800 },
              ],
              averagePerformancePercent: 90.8,
            },
            review: {
              status: "Completed",
              message: "Approved.",
              reviewedBy: "Admin",
              reviewedAt: "2025-11-29T10:05:00.000Z",
            },
          },
          {
            id: "ms_winter_yt_short",
            title: "YouTube Short",
            dayLabel: "DAY 3",
            dueDate: "2025-12-01T00:00:00.000Z",
            status: "Completed",
            contentRequirements: ["1 YouTube Short (30–60 sec)"],
            actions: { canReportAdmin: true, canViewSubmittedReport: true },
            submission: {
              id: "sub_winter_yt",
              description: "Short posted with CTA and pinned comment.",
              platformLinks: [
                {
                  platform: "youtube",
                  url: "https://youtube.com/shorts/winter_yt_01",
                },
              ],
              proofs: [
                {
                  id: "proof_winter_yt_1",
                  type: "video",
                  url: "https://cdn.example.com/proofs/winter/yt_short.mp4",
                  previewUrl:
                    "https://cdn.example.com/proofs/winter/yt_thumb.png",
                  label: "Video File",
                },
              ],
              submittedAt: "2025-12-01T09:30:00.000Z",
              updatedAt: "2025-12-01T09:40:00.000Z",
            },
            performance: {
              targetHitThresholdPercent: 75,
              metrics: [
                {
                  key: "views",
                  label: "Views",
                  current: 220000,
                  target: 150000,
                },
                { key: "likes", label: "Likes", current: 28000, target: 20000 },
                {
                  key: "comments",
                  label: "Comments",
                  current: 2100,
                  target: 1500,
                },
              ],
              averagePerformancePercent: 92.0,
            },
            review: {
              status: "Completed",
              message: "Approved. Great pacing and clarity.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-01T12:00:00.000Z",
            },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_john",
    expandedMilestoneId: "ms_winter_yt_short",
  },

  // =========================================================
  // 4) Draft (no influencers assigned yet)
  // =========================================================
  {
    id: "cmp_draft_004",
    title: "Spring Collection Teaser",
    brand: {
      id: "br_styleco",
      name: "StyleCo.",
      logoUrl: "https://cdn.example.com/brands/styleco/logo.png",
    },

    tabStatus: "Draft",
    stage: "Submitted",

    platforms: ["instagram", "tiktok"],

    deadline: {
      date: "2026-01-10T00:00:00.000Z",
      daysRemainingLabel: "Draft",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 18000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 2700 },
      totalCost: { currency: "BDT", amount: 20700 },
      paidAmount: { currency: "BDT", amount: 0 },
      dueAmount: { currency: "BDT", amount: 20700 },
      statusLabel: "DUE",
    },

    rating: { canRate: false },

    progressStepper: {
      currentStage: "Submitted",
      stages: [
        { stage: "Submitted", isDone: true, doneLabel: "Draft Created" },
        { stage: "Quoted", isDone: false, doneLabel: "Awaiting Quote" },
        { stage: "Paid", isDone: false },
        { stage: "Promoting", isDone: false },
        { stage: "Completed", isDone: false },
      ],
    },

    contentAssets: [
      {
        id: "asset_spring_moodboard",
        title: "Moodboard",
        fileType: "PDF",
        sizeLabel: "2.0 MB",
        downloadUrl:
          "https://cdn.example.com/assets/styleco/spring-moodboard.pdf",
      },
    ],

    brief: {
      campaignGoals:
        "Tease upcoming spring collection and boost follows + wishlists.",
      productOrServiceDetails:
        "Spring apparel drop with pastel palette and minimal styling.",
      contentRequirements: ["1 TikTok Teaser", "1 Instagram Post", "2 Stories"],
      dos: ["Keep it aesthetic", "Short hooks", "Use soft music"],
      donts: ["No pricing reveal", "No competitor brands"],
    },

    terms: {
      reportingRequirements: ["Submit analytics after 7 days."],
      usageRights: ["Brand can repost with credit."],
      notes: ["Draft: influencers not assigned yet."],
    },

    influencerCampaigns: [],
    selectedInfluencerId: "",
    expandedMilestoneId: undefined,
  },

  // =========================================================
  // 5) Cancelled (actions disabled)
  // =========================================================
  {
    id: "cmp_cancel_005",
    title: "Holiday Deals Blast",
    brand: {
      id: "br_fitlife",
      name: "FitLife",
      logoUrl: "https://cdn.example.com/brands/fitlife/logo.png",
    },

    tabStatus: "Cancelled",
    stage: "Quoted",

    platforms: ["instagram", "youtube", "tiktok"],

    deadline: {
      date: "2025-12-18T00:00:00.000Z",
      daysRemainingLabel: "Cancelled",
    },

    quote: {
      baseBudget: { currency: "BDT", amount: 18000 },
      vatPercent: 15,
      vatAmount: { currency: "BDT", amount: 2700 },
      totalCost: { currency: "BDT", amount: 20700 },
      paidAmount: { currency: "BDT", amount: 0 },
      dueAmount: { currency: "BDT", amount: 20700 },
      statusLabel: "DUE",
    },

    rating: { canRate: false },

    progressStepper: {
      currentStage: "Quoted",
      stages: [
        { stage: "Submitted", isDone: true },
        { stage: "Quoted", isDone: true },
        { stage: "Paid", isDone: false },
        { stage: "Promoting", isDone: false },
        { stage: "Completed", isDone: false },
      ],
    },

    contentAssets: [
      {
        id: "asset_holiday_copy",
        title: "Holiday Copy & Hashtags",
        fileType: "DOCX",
        sizeLabel: "210 KB",
        downloadUrl: "https://cdn.example.com/assets/fitlife/holiday-copy.docx",
      },
    ],

    brief: {
      campaignGoals:
        "Drive traffic to holiday landing page and boost conversions.",
      productOrServiceDetails:
        "Limited-time holiday discounts across top products.",
      contentRequirements: [
        "1 TikTok Video",
        "1 YouTube Short",
        "1 Instagram Post",
      ],
      dos: ["Clear CTA", "Mention limited time", "Use provided hashtags"],
      donts: ["No false urgency", "No competitor mention"],
    },

    terms: {
      reportingRequirements: ["N/A (campaign cancelled)"],
      usageRights: ["N/A"],
      notes: ["Cancelled by brand before payment."],
    },

    influencerCampaigns: [
      {
        influencer: {
          id: "inf_hania",
          name: "Hania Amir",
          avatarUrl: "https://cdn.example.com/influencers/hania/avatar.png",
          handle: "@hania",
        },
        progress: { completedCount: 0, totalCount: 3, percentCompleted: 0 },
        milestones: [
          {
            id: "ms_cancel_ig",
            title: "Instagram Post",
            dayLabel: "DAY 1",
            dueDate: "2025-12-16T00:00:00.000Z",
            status: "Declined",
            contentRequirements: ["1 Instagram Post"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
            review: {
              status: "Declined",
              message: "Campaign cancelled. Do not proceed.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-12T09:00:00.000Z",
            },
          },
          {
            id: "ms_cancel_tt",
            title: "TikTok Video",
            dayLabel: "DAY 2",
            dueDate: "2025-12-17T00:00:00.000Z",
            status: "Declined",
            contentRequirements: ["1 TikTok Video (30–45 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
            review: {
              status: "Declined",
              message: "Campaign cancelled. Do not proceed.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-12T09:00:00.000Z",
            },
          },
          {
            id: "ms_cancel_yt",
            title: "YouTube Short",
            dayLabel: "DAY 3",
            dueDate: "2025-12-18T00:00:00.000Z",
            status: "Declined",
            contentRequirements: ["1 YouTube Short (30–60 sec)"],
            actions: { canReportAdmin: false, canViewSubmittedReport: false },
            review: {
              status: "Declined",
              message: "Campaign cancelled. Do not proceed.",
              reviewedBy: "Admin",
              reviewedAt: "2025-12-12T09:00:00.000Z",
            },
          },
        ],
      },
    ],

    selectedInfluencerId: "inf_hania",
    expandedMilestoneId: "ms_cancel_ig",
  },
];
