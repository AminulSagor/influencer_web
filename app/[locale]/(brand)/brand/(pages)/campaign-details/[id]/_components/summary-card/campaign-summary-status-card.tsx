import React from "react";
import { FiClock } from "react-icons/fi";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

type CampaignSummaryStatusCardProps = {
  deadlineDate: string;
  rating: number;
};

function CompletionStars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="mt-4 flex items-center justify-center gap-1.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < filled
              ? "fill-[#F5C542] text-[#F5C542]"
              : "fill-white/40 text-white/40"
          }`}
        />
      ))}
    </div>
  );
}

export default function CampaignSummaryStatusCard({
  deadlineDate,
  rating,
}: CampaignSummaryStatusCardProps) {
  const t = useTranslations("brand.CampaignDetailsPage");

  return (
    <div className="order-1 border">
      <div className="w-full rounded-xl border border-white/70 bg-linear-to-l from-Primary to-light-green px-5 py-5 backdrop-blur-sm sm:min-w-60 lg:w-[250px]">
        <div className="text-center text-sm font-medium text-white">
          {t("campaignSummaryStatusCard.status")}
        </div>

        <div className="mt-2 text-center text-2xl font-semibold text-white sm:text-[28px]">
          {t("campaignSummaryStatusCard.completed")}
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-white">
          <FiClock className="h-4 w-4" />
          <span className="truncate">{deadlineDate}</span>
        </div>

        <CompletionStars rating={rating} />
      </div>
    </div>
  );
}
