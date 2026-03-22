"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import MilestoneSubmissionsSection from "./milestone-submissions-section";
import InfluencerPromotionMilestoneContent from "./influencer-promotion-milestone-content";
import PaidAdMilestoneContent from "./paid-ad-milestone-content";
import MilestoneBonusCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/milestone-bonus-card";

type Props = {
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
  milestoneIndex: number;
  submissionId?: string | null;
};

export default function MilestoneDetailsCard({
  campaign,
  milestone,
  milestoneIndex,
  submissionId,
}: Props) {
  const t = useTranslations("brand.CampaignDetailsPage");

  const isInfluencerPromotion =
    String(campaign.campaignType ?? "").toLowerCase() ===
    "influencer_promotion";

  const safeTitle =
    milestone.contentTitle?.trim() || `${t("milestone")} ${milestoneIndex + 1}`;

  const normalizedMilestoneStatus = String(
    milestone.status ?? "",
  ).toLowerCase();
  const shouldShowBonusCard = normalizedMilestoneStatus === "completed";

  console.log("id", milestone.id);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="milestone-details"
    >
      <AccordionItem value="milestone-details" className="border-none">
        <div className="rounded-2xl border border-[#CFCFCF] bg-[#FBFBFB] px-4 py-4 sm:px-6 sm:py-5">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-start gap-3 text-left">
              <Image
                src="/icons/milestone.svg"
                alt="Milestone"
                width={30}
                height={30}
                className="mt-1 h-[26px] w-[26px] shrink-0 sm:h-[30px] sm:w-[30px]"
              />

              <div>
                <p className="text-sm font-medium leading-none text-[#47662D]">
                  {t("milestone")} {milestoneIndex + 1}
                </p>
                <h3 className="mt-2 text-base font-semibold leading-none text-[#2E5B1F]">
                  {safeTitle}
                </h3>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-0 pt-5">
            {isInfluencerPromotion ? (
              <InfluencerPromotionMilestoneContent
                milestone={milestone}
                submissionId={submissionId}
              />
            ) : (
              <PaidAdMilestoneContent milestone={milestone} />
            )}

            <div className="mt-5">
              <MilestoneSubmissionsSection
                campaign={campaign}
                milestone={milestone}
              />
            </div>
          </AccordionContent>

          {shouldShowBonusCard ? (
            <div className="mt-5">
              <MilestoneBonusCard
                milestoneId={milestone.id}
                campaignType={String(campaign.campaignType ?? "")}
              />
            </div>
          ) : null}
        </div>
      </AccordionItem>
    </Accordion>
  );
}
