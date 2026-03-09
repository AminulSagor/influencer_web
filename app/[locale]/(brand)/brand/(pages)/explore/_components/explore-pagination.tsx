"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { ExploreType } from "@/app/[locale]/(brand)/brand/(pages)/explore/explore-query";

type Props = {
  currentPage: number;
  totalPages: number;
  activeType: ExploreType;
  limit: number;
};

export default function ExplorePagination({
  currentPage,
  totalPages,
  activeType,
  limit,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", activeType);
    params.set("page", String(page));
    params.set("limit", String(limit));
    router.push(`${pathname}?${params.toString()}`);
  };

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className="mt-16 flex justify-end text-sm text-dark-gray">
      <div className="flex items-center gap-4 md:gap-9">
        <div className="flex items-center gap-2">
          <span>Page</span>
          <span className="flex h-8 w-12 items-center justify-center rounded-lg border border-light-green bg-Secondary/70">
            {currentPage}
          </span>
          <span>of</span>
          <span>{totalPages}</span>
        </div>

        <div className="flex items-center gap-3">
          <PrimaryButton
            className="px-5"
            onClick={() => goToPage(currentPage - 1)}
            disabled={isPreviousDisabled}
          >
            Previous
          </PrimaryButton>

          <PrimaryButton
            className="px-5"
            onClick={() => goToPage(currentPage + 1)}
            disabled={isNextDisabled}
          >
            Next
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
