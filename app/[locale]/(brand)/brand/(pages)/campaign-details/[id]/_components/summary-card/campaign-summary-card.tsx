import { Card, CardContent } from "@/components/ui/card";
import { CampaignDetails } from "@/types/client/campaigns/campaign-details";
import CampaignSummaryHeader from "./campaign-summary-header";
import CampaignSummaryStatusCard from "./campaign-summary-status-card";
import CampaignSummaryDeadlineCard from "./campaign-summary-deadline-card";

type CampaignSummaryCardProps = {
  campaign: CampaignDetails;
  label?: string;
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const addDays = (iso: string, days: number) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const daysBetween = (aIso?: string | null, bIso?: string | null) => {
  if (!aIso || !bIso) return null;
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
};

const toNumber = (value?: string | number | null) => {
  if (value == null) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function CampaignSummaryCard({
  campaign,
  label = "Campaign Details",
}: CampaignSummaryCardProps) {
  const title = campaign.campaignName;
  const isInfluencerCampaign = campaign.campaignType === "influencer_promotion";
  const isPaidAdCampaign = campaign.campaignType === "paid_ad";

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

  const platforms = Array.from(
    new Set(
      (campaign.milestones ?? []).map((m) => String(m.platform).toLowerCase()),
    ),
  ).filter(Boolean);

  const assignedInfluencers = Array.from(
    new Map(
      (campaign.milestones ?? [])
        .filter(
          (item) =>
            typeof item.influencerName === "string" &&
            item.influencerName.trim().length > 0,
        )
        .map((item) => [
          item.influencerName!.trim().toLowerCase(),
          {
            name: item.influencerName!.trim(),
            image: item.influencerImage ?? null,
          },
        ]),
    ).values(),
  ).slice(0, 3);

  const assignedInfluencerNames = assignedInfluencers.map((item) => item.name);

  const activeAgency =
    campaign.assignedAgencies?.find((item) => !item.isDeclined) ||
    campaign.assignedAgencies?.[0] ||
    null;

  const agencyName = activeAgency?.agency?.agencyName || null;
  const agencyLogo = activeAgency?.agency?.logo || null;

  const showInfluencerSection =
    isInfluencerCampaign && assignedInfluencerNames.length > 0;

  const showAgencySection = isPaidAdCampaign && Boolean(agencyName);

  const showPeopleSection = showInfluencerSection || showAgencySection;

  const totalBudgetValue = toNumber(campaign.totalBudget);
  const availableBudgetValue = toNumber(campaign.availableBudgetForExecution);

  const isPending = campaign.paymentStatus === "pending";
  const isPartialPaid = campaign.paymentStatus === "partial";
  const isPaid = campaign.paymentStatus === "paid";

  const paidAmount = isPaid
    ? totalBudgetValue
    : isPartialPaid
      ? Math.max(totalBudgetValue - availableBudgetValue, 0)
      : 0;

  const dueAmount = Math.max(totalBudgetValue - paidAmount, 0);

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

            <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row items-start">
              {isCompleted ? (
                <CampaignSummaryStatusCard
                  deadlineDate={deadlineDate}
                  rating={numericRating}
                />
              ) : (
                <CampaignSummaryDeadlineCard
                  deadlineLabel={deadlineLabel}
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
