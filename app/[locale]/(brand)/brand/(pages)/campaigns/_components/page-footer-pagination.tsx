"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
};

export default function PageFooterPagination({
  page,
  totalPages,
  onNext,
  onPrev,
}: Props) {
  const t = useTranslations("brand.CampaignsPage");

  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(page, 1), totalPages);

  return (
    <div className="flex items-center justify-end gap-3">
      <p className="text-sm text-muted-foreground">
        {t("page")}{" "}
        <span className="inline-flex items-center justify-center min-w-7 px-2 py-1 rounded-md border bg-Secondary border-light-green text-Primary">
          {safePage}
        </span>{" "}
        {t("of")} {totalPages}
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={safePage <= 1}
        onClick={onPrev}
      >
        {t("prev")}
      </Button>

      <Button
        type="button"
        size="sm"
        className="bg-light-green hover:bg-light-green/85"
        disabled={safePage >= totalPages}
        onClick={onNext}
      >
        {t("next")}
      </Button>
    </div>
  );
}
