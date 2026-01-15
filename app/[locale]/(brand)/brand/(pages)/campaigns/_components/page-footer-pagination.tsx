"use client";

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
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-3">
      <p className="text-sm text-muted-foreground">
        Page{" "}
        <span className="inline-flex items-center justify-center min-w-7 px-2 py-1 rounded-md border bg-Secondary border-light-green text-Primary">
          {page}
        </span>{" "}
        Of {totalPages}
      </p>

      <Button
        size="sm"
        className="bg-light-green hover:bg-light-green/85"
        disabled={page >= totalPages}
        onClick={onNext}
      >
        Next
      </Button>

      <Button size="sm" variant="outline" disabled={page <= 1} onClick={onPrev}>
        Prev
      </Button>
    </div>
  );
}
