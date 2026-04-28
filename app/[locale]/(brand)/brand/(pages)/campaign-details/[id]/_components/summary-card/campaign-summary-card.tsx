import { Card, CardContent } from "@/components/ui/card";
import CampaignSummaryHeader from "./campaign-summary-header";
import CampaignSummaryStatusCard from "./campaign-summary-status-card";
import CampaignSummaryDeadlineCard from "./campaign-summary-deadline-card";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";
import {
  addDays,
  formatDate,
  daysBetween,
  toNumber,
} from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/summary-card/helpers/helper";

type CampaignSummaryCardProps = {
  campaign: ClientCampaignDetails;
  label?: string;
};

export default function CampaignSummaryCard({
  campaign,
  label = "Campaign Details",
}: CampaignSummaryCardProps) {
  // Campaign type flags
  const title = campaign.campaignName;
  const isInfluencerCampaign = campaign.campaignType === "influencer_promotion";
  const isPaidAdCampaign = campaign.campaignType === "paid_ad";

  //
  const endIso =
    campaign.startingDate && campaign.duration
      ? addDays(campaign.startingDate, campaign.duration)
      : null;

  const remaining = endIso
    ? daysBetween(new Date().toISOString(), endIso)
    : null;

  const deadlineLabel =
    remaining == null
      ? "—"
      : remaining <= 0
        ? "Expired"
        : `${remaining} Days Remaining`;

  const deadlineDate = formatDate(endIso);

  const assignedWorkPlatforms = campaign.assignedInfluencers.flatMap(
    (influencer) => influencer.assignedWork.map((work) => work.platform),
  );

  const milestonePlatforms = (campaign.milestones ?? []).map(
    (milestone) => milestone.platform,
  );

  const platforms = Array.from(
    new Set(
      (assignedWorkPlatforms.length > 0
        ? assignedWorkPlatforms
        : milestonePlatforms
      )
        .map((platform) => String(platform).toLowerCase())
        .filter(Boolean),
    ),
  );

  const assignedInfluencers = campaign.assignedInfluencers
    .map((item) => ({
      name: item.name,
      image: item.image,
    }))
    .slice(0, 3);

  const assignedInfluencerNames = assignedInfluencers.map((item) => item.name);

  const showInfluencerSection =
    isInfluencerCampaign && assignedInfluencers.length > 0;

  const agencyName = null;
  const agencyLogo = null;

  const showAgencySection = isPaidAdCampaign && Boolean(agencyName);
  const showPeopleSection = showInfluencerSection || showAgencySection;

  const totalBudgetValue = toNumber(
    campaign.paymentInfo?.totalAmount ?? campaign.totalBudget,
  );
  const paidAmountValue = toNumber(
    campaign.paymentInfo?.paidAmount ?? campaign.paidAmount,
  );
  const dueAmountValue = toNumber(
    campaign.paymentInfo?.dueAmount ?? campaign.dueAmount,
  );

  const isPending = campaign.paymentStatus === "pending";
  const isPartialPaid = campaign.paymentStatus === "partial";
  const isPaid = campaign.paymentStatus === "paid";

  const paidAmount = isPaid ? totalBudgetValue : paidAmountValue;
  const dueAmount = Math.max(
    dueAmountValue || totalBudgetValue - paidAmount,
    0,
  );

  const isCompleted = campaign.status === "completed";

  const showBudgetPendingPill = isPending && isInfluencerCampaign;

  const showAgencyConfirmationPendingPill =
    isPaidAdCampaign &&
    !agencyName &&
    [
      "pending_agency",
      "agency_negotiating",
      "received",
      "negotiating",
    ].includes(campaign.status);

  const numericRating = toNumber(campaign.rating);

  const status = campaign.status;

  return (
    <Card className="overflow-hidden border-0 bg-linear-to-r from-Primary to-light-green p-0 shadow-none">
      <CardContent className="p-0">
        <div className="px-4 py-4 text-white sm:px-6 sm:py-5">
          <div className="flex flex-col items-stretch gap-5 lg:flex-row lg:justify-between lg:gap-6">
            <CampaignSummaryHeader
              label={label}
              title={title}
              platforms={platforms}
              showPeopleSection={showPeopleSection}
              showInfluencerSection={showInfluencerSection}
              assignedInfluencers={assignedInfluencers}
              assignedInfluencerNames={assignedInfluencerNames}
              agencyName={agencyName}
              agencyLogo={agencyLogo}
            />

            <div className="flex w-full flex-col items-stretch gap-2 lg:w-auto lg:flex-row lg:items-stretch">
              {isCompleted ? (
                <CampaignSummaryStatusCard
                  deadlineDate={deadlineDate}
                  rating={numericRating}
                />
              ) : (
                <CampaignSummaryDeadlineCard
                  deadlineLabel={deadlineLabel}
                  campaignStatus = {status}
                  deadlineDate={deadlineDate}
                  dueAmount={dueAmount}
                  isPartialPaid={isPartialPaid}
                  showBudgetPendingPill={showBudgetPendingPill}
                  showAgencyConfirmationPendingPill={
                    showAgencyConfirmationPendingPill
                  }
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
