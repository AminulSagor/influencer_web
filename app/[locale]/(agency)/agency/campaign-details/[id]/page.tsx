import { Card, CardContent } from "@/components/ui/card";
import BrandAssetCard from "../_components/brand-asset-card";
import CampaignDetailsCard from "../_components/campaign-details-card";
import ContentAssetCard from "../_components/content-asset-card";
import DeadlineCard from "../_components/deadline-card";
import QuoteDetailsCard from "../_components/quote-details-card";
import RequoteTimeLeftCard from "../_components/requote-time-left-card";
import CampaignBrief from "../_components/campaign-brief";
import TermsAndConditions from "../_components/terms-and-conditions";
import TotalEarningCard from "../_components/total-earning-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiSolidLeftArrow } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import { AiFillTikTok } from "react-icons/ai";
import MilestoneClient from "./milestone-client";
import NotificationRefresh from "./notification-refresh";
import { getAgencyCampaignDetails } from "@/service/agency/job-details";
import type { AgencyCampaignMilestone } from "@/types/agency/job-details";
import type { MilestoneTargetTitle } from "@/types/agency/campaign/milestone-submission.types";
import {
  IN_REVIEW,
  PAID,
  PARTIAL_PAID,
  TODO,
  type PaymanetMilestoneDataType,
} from "./consts";
import { cookies } from "next/headers";

const formatCompactNumber = (value: number | null | undefined) => {
  if (!value) return "N/A";

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }

  return String(value);
};

const mapMilestoneStatus = (status: string) => {
  const normalized = String(status).toLowerCase();

  if (normalized === "paid") return PAID;
  if (normalized === "partial_paid" || normalized === "partial-paid") {
    return PARTIAL_PAID;
  }
  if (normalized === "in_review" || normalized === "in-review") {
    return IN_REVIEW;
  }

  return TODO;
};

const getPromotionTargetConfig = (
  milestone: AgencyCampaignMilestone
): { title: MilestoneTargetTitle | null; value: number | null } => {
  if (milestone.expectedReach != null) {
    return { title: "Reach", value: Number(milestone.expectedReach) };
  }

  if (milestone.expectedViews != null) {
    return { title: "Views", value: Number(milestone.expectedViews) };
  }

  if (milestone.expectedLikes != null) {
    return { title: "Likes", value: Number(milestone.expectedLikes) };
  }

  if (milestone.expectedComments != null) {
    return { title: "Comments", value: Number(milestone.expectedComments) };
  }

  if (milestone.expectedFollows != null) {
    return { title: "Follows", value: Number(milestone.expectedFollows) };
  }

  return { title: null, value: null };
};

const mapMilestones = (
  milestones: AgencyCampaignMilestone[]
): PaymanetMilestoneDataType[] => {
  return [...milestones]
    .sort((a, b) => a.order - b.order)
    .map((milestone, index) => {
      const targetConfig = getPromotionTargetConfig(milestone);

      return {
        id: index + 1,
        milestoneId: milestone.id,
        title: milestone.contentTitle,
        contentRequirement: [milestone.contentQuantity],
        promotionTarget: formatCompactNumber(targetConfig.value),
        targetTitle: targetConfig.title,
        payout: Number(milestone.amount ?? 0),
        status: mapMilestoneStatus(milestone.status),
        day: milestone.deliveryDays,
        promotionalGoal: milestone.promotionGoal ?? "N/A",
        submissions: milestone.submissions,
      };
    });
};

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ from?: string }>;
}) => {
  const { id, locale } = await params;
  const { from } = await searchParams;

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const response = await getAgencyCampaignDetails(id, token);
  const campaign = response.data;

  const normalizedStatus = String(campaign.status).toLowerCase();
  const isAccepted =
    normalizedStatus === "active" || normalizedStatus === "completed";

  const isForcedQuotedView = from === "quoted";

  const milestoneData = mapMilestones(campaign.milestones);
  const paidMilestones = milestoneData.filter(
    (item) => item.status === PAID || item.status === PARTIAL_PAID
  ).length;
  const contentAssets = (campaign.assets ?? []).filter(
    (asset) => asset.category?.toLowerCase() === "content"
  );
  const brandAssets = (campaign.assets ?? []).filter(
    (asset) => asset.category?.toLowerCase() === "brand"
  );

  return (
    <div className="p-4 space-y-4">
      <NotificationRefresh />
      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-12 sm:col-span-6 h-full">
          {isAccepted ? (
            <div className="flex h-full flex-col rounded-lg bg-linear-to-r from-Primary to-light-green p-4">
              <div>
                <Button
                  variant="link"
                  asChild
                  className="has-[>svg]:px-0 text-dark-gray font-medium"
                >
                  <Link href={`/${locale}/agency/jobs`}>
                    <BiSolidLeftArrow />
                    Back to Campaigns
                  </Link>
                </Button>
              </div>

              <div className="flex flex-1 flex-col space-y-2">
                <h2 className="text-lg font-semibold text-Secondary">
                  {campaign.campaignName}
                </h2>

                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={campaign.client.profileImg ?? ""} />
                    <AvatarFallback>
                      {campaign.client.brandName?.charAt(0) ?? "B"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-Secondary text-sm font-medium">
                    {campaign.client.brandName}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <p className="text-Secondary text-sm font-medium">
                    Platforms
                  </p>
                  <div className="flex gap-2">
                    <span>
                      <RiInstagramFill size={30} className="fill-Secondary" />
                    </span>
                    <span>
                      <RiYoutubeFill size={30} className="fill-Secondary" />
                    </span>
                    <span>
                      <AiFillTikTok size={30} className="fill-Secondary" />
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <Button
                    size="lg"
                    className="w-full bg-linear-to-r from-Secondary to-white text-light-green hover:from-Secondary hover:to-white hover:text-light-green hover:bg-linear-to-r"
                  >
                    Ongoing Campaign
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <CampaignDetailsCard
              isAccepted={false}
              campaign={campaign}
              forceQuotedView={isForcedQuotedView}
            />
          )}
        </div>

        {isAccepted && (
          <div className="col-span-12 sm:col-span-6 grid h-full grid-rows-2 gap-4">
            <div className="h-full">
              <DeadlineCard
                startingDate={campaign.startingDate}
                duration={campaign.duration}
              />
            </div>
            <div className="h-full">
              <TotalEarningCard
                amount={campaign.budgetBreakdown.estimatedAgencyProfit}
              />
            </div>
          </div>
        )}

        {!isAccepted && (
          <>
            <div className="col-span-12 sm:col-span-3">
              <RequoteTimeLeftCard
                timeLeftToRequoteMinutes={campaign.timeLeftToRequoteMinutes}
                invitedAt={campaign.invitedAt}
              />
            </div>
            <div className="col-span-12 sm:col-span-3">
              <DeadlineCard
                startingDate={campaign.startingDate}
                duration={campaign.duration}
              />
            </div>
          </>
        )}
      </div>

      <div className="grid-cols-12 grid gap-4">
        <div className="col-span-12 sm:col-span-4">
          <ContentAssetCard assets={contentAssets} />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <BrandAssetCard assets={brandAssets} />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <QuoteDetailsCard budgetBreakdown={campaign.budgetBreakdown} />
        </div>
      </div>

      <div>
        <Card>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start">
              <CampaignBrief
                campaignGoals={campaign.campaignGoals}
                milestones={campaign.milestones}
                dos={campaign.dos}
                donts={campaign.donts}
              />
              <TermsAndConditions
                reportingRequirements={campaign.reportingRequirements}
                usageRights={campaign.usageRights}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <MilestoneClient
        isAccepted={isAccepted}
        milestones={milestoneData}
        paid={paidMilestones}
        total={milestoneData.length}
      />
    </div>
  );
};

export default page;