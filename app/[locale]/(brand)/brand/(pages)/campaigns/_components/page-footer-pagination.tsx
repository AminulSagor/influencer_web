"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const PAGE_CHANGE_DELAY_MS = 500;

type PaginationLabels = {
  page?: string;
  of?: string;
  prev?: string;
  next?: string;
};

type Props = {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  onPageChange: (page: number) => void;
  labels?: PaginationLabels;
};

export default function PageFooterPagination({
  page,
  totalPages,
  onNext,
  onPrev,
  onPageChange,
  labels,
}: Props) {
  const t = useTranslations("brand.CampaignsPage");
  const labelText = {
    page: labels?.page ?? t("page"),
    of: labels?.of ?? t("of"),
    prev: labels?.prev ?? t("prev"),
    next: labels?.next ?? t("next"),
  };
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);
  const [pageInput, setPageInput] = useState(String(safePage));

  useEffect(() => {
    setPageInput(String(safePage));
  }, [safePage]);

  const parsedInputPage = useMemo(() => {
    if (!pageInput) return null;

    const nextPage = Number(pageInput);
    if (!Number.isInteger(nextPage)) return null;

    return Math.min(Math.max(nextPage, 1), safeTotalPages);
  }, [pageInput, safeTotalPages]);

  useEffect(() => {
    if (!parsedInputPage || parsedInputPage === safePage) return;

    const timer = window.setTimeout(() => {
      onPageChange(parsedInputPage);
    }, PAGE_CHANGE_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onPageChange, parsedInputPage, safePage]);

  if (safeTotalPages <= 1) return null;

  const commitPageInput = () => {
    if (!pageInput) {
      setPageInput(String(safePage));
      return;
    }

    if (parsedInputPage) {
      setPageInput(String(parsedInputPage));
      if (parsedInputPage !== safePage) {
        onPageChange(parsedInputPage);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>{labelText.page}</span>
        <input
          aria-label="Page number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={pageInput}
          onChange={(event) => {
            const onlyNumbers = event.target.value.replace(/\D/g, "");
            setPageInput(onlyNumbers);
          }}
          onBlur={commitPageInput}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          className="border-light-green bg-Secondary text-Primary h-8 w-14 rounded-md border px-2 text-center text-sm font-semibold outline-none transition focus:ring-2 focus:ring-light-green/40"
        />
        <span>
          {labelText.of} {safeTotalPages}
        </span>
      </div>

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={safePage <= 1}
        onClick={onPrev}
      >
        {labelText.prev}
      </Button>

      <Button
        type="button"
        size="sm"
        className="bg-light-green hover:bg-light-green/85"
        disabled={safePage >= safeTotalPages}
        onClick={onNext}
      >
        {labelText.next}
      </Button>
    </div>
  );
}
