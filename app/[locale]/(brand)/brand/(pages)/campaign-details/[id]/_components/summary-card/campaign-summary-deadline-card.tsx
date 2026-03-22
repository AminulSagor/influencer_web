import React from "react";
import { FiClock } from "react-icons/fi";
import Image from "next/image";
import { useTranslations } from "next-intl";

type CampaignSummaryDeadlineCardProps = {
  deadlineLabel: string;
  deadlineDate: string;
  dueAmount: number;
  isPartialPaid: boolean;
  showBudgetPendingPill: boolean;
  showAgencyConfirmationPendingPill: boolean;
};

const formatCurrency = (value: number) => {
  return `৳${value.toLocaleString("en-BD")}`;
};

export default function CampaignSummaryDeadlineCard({
  deadlineLabel,
  deadlineDate,
  dueAmount,
  isPartialPaid,
  showBudgetPendingPill,
  showAgencyConfirmationPendingPill,
}: CampaignSummaryDeadlineCardProps) {
  const t = useTranslations("brand.CampaignDetailsPage");

  return (
    <>
      {isPartialPaid && dueAmount > 0 && (
        <div className="order-2 flex min-h-[170px] min-w-[170px] flex-col items-center justify-center gap-2 rounded-xl border border-white/70 bg-linear-to-l from-Primary to-light-green p-4 lg:order-1">
          <Image
            src="/client-panel/money.png"
            alt={t("campaignSummaryDeadlineCard.moneyImgAlt")}
            height={24}
            width={24}
          />
          <h1 className="text-sm font-medium text-white">
            {t("campaignSummaryDeadlineCard.totalDue")}
          </h1>
          <p className="text-xl font-semibold text-white">
            {formatCurrency(dueAmount)}
          </p>
        </div>
      )}

      <div className="order-1">
        <div className="flex flex-col gap-3 lg:justify-end">
          <div className="w-full rounded-xl border border-white/70 bg-linear-to-l from-Primary to-light-green px-5 py-5 backdrop-blur-sm sm:min-w-60 lg:w-[370px]">
            <div className="text-center text-sm font-medium text-white">
              {t("campaignSummaryDeadlineCard.deadline")}
            </div>

            <div className="mt-3 text-center text-xl font-semibold text-white">
              {deadlineLabel}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white">
              <FiClock className="h-4 w-4" />
              <span className="truncate">{deadlineDate}</span>
            </div>
          </div>
        </div>

        {showBudgetPendingPill && (
          <div className="mt-3 flex w-full justify-center">
            <span className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-Primary">
              {t("campaignSummaryDeadlineCard.budgetPending")}
            </span>
          </div>
        )}

        {showAgencyConfirmationPendingPill && (
          <div className="mt-3 flex w-full justify-center">
            <span className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-Primary">
              {t("campaignSummaryDeadlineCard.agencyConfirmationPending")}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
