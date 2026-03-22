"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import { useTranslations } from "next-intl";
import MilestoneBonusDialog from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/milestone-bonus-dialog";

export default function MilestoneBonusCard({
  milestoneId,
  campaignType,
}: {
  milestoneId: string;
  campaignType: string;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("brand.CampaignDetailsPage");

  return (
    <>
      <div className="rounded-[10px] bg-[#5C7F3C] p-4 text-white">
        <div className="flex items-start gap-2">
          <Gift className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-sm font-semibold">{t("bonus")}</p>
            <p className="mt-1 text-xs font-normal text-white/90">
              {t("rewardThisCompletedMilestoneWithABonusPayment")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 flex h-10 w-full items-center justify-center rounded-[8px] bg-[#F5F5E8] px-4 text-center text-sm font-medium text-[#5C7F3C] transition hover:opacity-90"
        >
          {t("provideBonusAmount")}
        </button>
      </div>

      <MilestoneBonusDialog
        open={open}
        onOpenChange={setOpen}
        milestoneId={milestoneId}
        campaignType={campaignType}
      />
    </>
  );
}
