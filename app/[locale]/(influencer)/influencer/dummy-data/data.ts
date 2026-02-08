export const campaignMocksData = [
  {
    id: "cmp_001",
    title: "Winter Skincare Launch",
    selectedInfluencerId: "inf_001",
    expandedMilestoneId: "ms_001",
    influencerCampaigns: [
      {
        id: "ic_001",
        influencer: {
          id: "inf_001",
          name: "Ayesha Rahman",
          avatarUrl: "/images/avatar-1.png",
        },
        progress: {
          completedCount: 1,
          totalCount: 3,
          percentCompleted: 33,
        },
        milestones: [
          {
            id: "ms_001",
            title: "Unboxing Reel",
            status: "Pending",
            dayLabel: "DAY 01",
            dueDate: "2026-02-12T00:00:00.000Z",
            contentRequirements: [
              "Reel",
              "15-30s",
              "Show packaging",
              "Voiceover",
            ],
            milestoneTargets: [
              { key: "views", label: "Views", target: 50000 },
              { key: "likes", label: "Likes", target: 2500 },
              { key: "comments", label: "Comments", target: 200 },
              { key: "shares", label: "Shares", target: 150 },
            ],
            actions: {
              canReportAdmin: true,
              canViewSubmittedReport: false,
            },
            submission: {
              description: "I will submit once posted.",
              platformLinks: [],
              proofs: [],
            },
            performance: {
              targetHitThresholdPercent: 70,
              averagePerformancePercent: 0,
              metrics: [
                { key: "views", label: "Views", current: 0, target: 50000 },
                { key: "likes", label: "Likes", current: 0, target: 2500 },
                { key: "comments", label: "Comments", current: 0, target: 200 },
              ],
            },
          },
          {
            id: "ms_002",
            title: "Story Sequence (3 Frames)",
            status: "In Review",
            dayLabel: "DAY 03",
            dueDate: "2026-02-15T00:00:00.000Z",
            contentRequirements: ["Story", "3 frames", "Swipe up link"],
            milestoneTargets: [
              { key: "reach", label: "Reach", target: 30000 },
              { key: "clicks", label: "Link Clicks", target: 600 },
            ],
            actions: {
              canReportAdmin: true,
              canViewSubmittedReport: true,
            },
            submission: {
              description:
                "Posted stories with link sticker. Waiting for review.",
              platformLinks: [
                {
                  platform: "Instagram",
                  url: "https://instagram.com/p/mock_story_1",
                },
                {
                  platform: "Instagram",
                  url: "https://instagram.com/p/mock_story_2",
                },
              ],
              proofs: [
                {
                  id: "pf_001",
                  label: "Story Screenshot 1",
                  previewUrl: "/images/proof-1.jpg",
                },
                {
                  id: "pf_002",
                  label: "Story Screenshot 2",
                  previewUrl: "/images/proof-2.jpg",
                },
                {
                  id: "pf_003",
                  label: "Story Screenshot 3",
                  previewUrl: "/images/proof-3.jpg",
                },
              ],
            },
            performance: {
              targetHitThresholdPercent: 70,
              averagePerformancePercent: 61.2,
              metrics: [
                { key: "reach", label: "Reach", current: 18200, target: 30000 },
                {
                  key: "clicks",
                  label: "Link Clicks",
                  current: 320,
                  target: 600,
                },
              ],
            },
          },
          {
            id: "ms_003",
            title: "Review Post (Carousel)",
            status: "Completed",
            dayLabel: "DAY 07",
            dueDate: "2026-02-19T00:00:00.000Z",
            contentRequirements: ["Carousel", "5 slides", "Tag brand", "CTA"],
            milestoneTargets: [
              { key: "views", label: "Views", target: 80000 },
              { key: "saves", label: "Saves", target: 1200 },
              { key: "comments", label: "Comments", target: 400 },
            ],
            actions: {
              canReportAdmin: false,
              canViewSubmittedReport: true,
            },
            submission: {
              description: "Posted carousel review with CTA + tagged brand.",
              platformLinks: [
                {
                  platform: "Instagram",
                  url: "https://instagram.com/p/mock_post_1",
                },
              ],
              proofs: [
                {
                  id: "pf_004",
                  label: "Post Preview",
                  previewUrl: "/images/proof-4.jpg",
                },
              ],
            },
            performance: {
              targetHitThresholdPercent: 70,
              averagePerformancePercent: 88.6,
              metrics: [
                { key: "views", label: "Views", current: 74500, target: 80000 },
                { key: "saves", label: "Saves", current: 1360, target: 1200 },
                {
                  key: "comments",
                  label: "Comments",
                  current: 420,
                  target: 400,
                },
              ],
            },
          },
        ],
      },
      {
        id: "ic_002",
        influencer: {
          id: "inf_002",
          name: "Nayeem Hasan",
          avatarUrl: "/images/avatar-2.png",
        },
        progress: {
          completedCount: 0,
          totalCount: 2,
          percentCompleted: 0,
        },
        milestones: [
          {
            id: "ms_101",
            title: "Teaser Story",
            status: "Pending",
            dayLabel: "DAY 01",
            dueDate: "2026-02-11T00:00:00.000Z",
            contentRequirements: ["Story", "Mention brand", "Poll"],
            milestoneTargets: [
              { key: "reach", label: "Reach", target: 20000 },
              { key: "votes", label: "Poll Votes", target: 800 },
            ],
            actions: {
              canReportAdmin: true,
              canViewSubmittedReport: false,
            },
            submission: {
              description: "",
              platformLinks: [],
              proofs: [],
            },
            performance: {
              targetHitThresholdPercent: 70,
              averagePerformancePercent: 0,
              metrics: [
                { key: "reach", label: "Reach", current: 0, target: 20000 },
                { key: "votes", label: "Poll Votes", current: 0, target: 800 },
              ],
            },
          },
          {
            id: "ms_102",
            title: "Short Review Reel",
            status: "Declined",
            dayLabel: "DAY 04",
            dueDate: "2026-02-16T00:00:00.000Z",
            contentRequirements: ["Reel", "Mention features", "CTA"],
            milestoneTargets: [
              { key: "views", label: "Views", target: 40000 },
              { key: "likes", label: "Likes", target: 1800 },
            ],
            actions: {
              canReportAdmin: true,
              canViewSubmittedReport: true,
            },
            submission: {
              description:
                "Uploaded reel proof, but waiting on revision due to missing CTA.",
              platformLinks: [
                { platform: "TikTok", url: "https://tiktok.com/@mock/reel1" },
              ],
              proofs: [
                {
                  id: "pf_901",
                  label: "Reel Screenshot",
                  previewUrl: "/images/proof-5.jpg",
                },
              ],
            },
            performance: {
              targetHitThresholdPercent: 70,
              averagePerformancePercent: 42.0,
              metrics: [
                { key: "views", label: "Views", current: 9800, target: 40000 },
                { key: "likes", label: "Likes", current: 410, target: 1800 },
              ],
            },
          },
        ],
      },
    ],
  },
] as const;
