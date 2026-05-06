"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight } from "lucide-react";
import RatingAvatar from "./rating-avatar";
import RatingStars from "./rating-stars";
import { formatRatedText } from "./rating-card.utils";
import { RateableEntity } from "./rating-card.types";

type RatingEntityRowProps = {
  entity: RateableEntity;
  value: number;
  expanded: boolean;
  onExpand: () => void;
  onChange: (value: number) => void;
};

export default function RatingEntityRow({
  entity,
  value,
  expanded,
  onExpand,
  onChange,
}: RatingEntityRowProps) {
  const t = useTranslations("brand.CampaignDetailsPage");

  return (
    <div className="overflow-hidden rounded-[18px] bg-[#5D8238] text-white">
      <button
        type="button"
        onClick={onExpand}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/5"
      >
        <RatingAvatar name={entity.name} image={entity.image} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[18px] font-semibold">{entity.name}</p>

          {!expanded && value > 0 && (
            <div className="mt-1">
              <RatingStars value={value} readonly size={20} />
            </div>
          )}
        </div>

        <span className="flex items-center gap-1 text-[16px] font-medium text-white/95">
          <span>{t("rate")}</span>
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-6 pt-2">
          <div className="flex flex-col items-center justify-center">
            <RatingStars value={value} onChange={onChange} size={42} />

            <p className="mt-4 text-center text-[18px] font-semibold text-white">
              {t("youveRated", { value: formatRatedText(value) })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
