import { Card } from "@/components/ui/card";
import CampaignDetailsCard from "../_components/campaign-details-card";
import DeadlineCard from "../_components/deadline-card";
import ContentAssetCard from "../_components/content-asset-card";
import PaymentMilestonesSection from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/payment-milestone";
import DeliveryLocation from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/delovery-location";
import CampaignBriefSection from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/campaign-brief-card";
import { Milestone } from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/types/type";
import { MilestoneDetailsPanel } from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/milestone-details-panel";

const milestones: Milestone[] = [
  {
    id: "m1",
    step: 1,
    title: "Initial Content Creation",
    subtitle: "2 Instagram Posts + 3 Stories",
    amount: 3000,
    dayLabel: "DAY 1",
    status: "approved",
    contentRequirements: ["2 Instagram Posts + 3 Stories"],
    targetMetrics: {
      reach: 300_000,
      views: 250_000,
      reactions: 300_000,
      comments: 300_000,
    },
    approvedAt: "Dec 15, 2025",
    submission: {
      approved: true,
      platformUrl: "facebook.com/haniq/live",
    },
  },
  {
    id: "m2",
    step: 2,
    title: "YouTube Video Upload",
    subtitle: "1 Sponsored Video (60 Sec)",
    amount: 5000,
    dayLabel: "DAY 2",
    status: "partial_paid",
  },
  {
    id: "m3",
    step: 3,
    title: "TikTok Campaign",
    subtitle: "1 Sponsored Video (60 Sec)",
    amount: 2000,
    dayLabel: "DAY 3",
    status: "in_review",
  },
  {
    id: "m4",
    step: 4,
    title: "Campaign Wrap Up",
    subtitle: "Final Report + 2 Instagram Stories",
    amount: 1000,
    dayLabel: "DAY 4",
    status: "declined",
  },
];

const page = async () => {
  return (
    <div className="p-4 space-y-4">
      {/* campaign details, deadline and offered amount */}
      <div className="grid md:grid-cols-2 gap-4">
        <CampaignDetailsCard />
        <div className="space-y-1.5">
          <DeadlineCard />
          <Card className=" border-light-gray rounded-lg p-4 shadow-md">
            <h2 className="text-Primary font-semibold ">Offered</h2>
            <h1 className="text-light-green text-2xl md:w-3xl font-semibold">
              ৳ 11,000
            </h1>
          </Card>
        </div>
      </div>

      {/* assets and delivery location */}
      <div className="sm:grid grid-cols-12 gap-4 space-y-2">
        <div className="col-span-8">
          <ContentAssetCard />
        </div>
        <div className=" col-span-4">
          <DeliveryLocation />
        </div>
      </div>

      {/* campaign brief and terms & conditions */}
      <CampaignBriefSection />

      {/* milestone */}
      <div className="mt-6">
        <PaymentMilestonesSection milestones={milestones} />
      </div>

      <div className="mt-5">
        {/* DETAILS IS OUTSIDE THE CARDS*/}
        <MilestoneDetailsPanel milestones={milestones} />
      </div>
    </div>
  );
};

export default page;
