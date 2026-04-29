"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import PageFooterPagination from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/page-footer-pagination";
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
  const t = useTranslations("brand.explore");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const safeTotalPages = Math.max(totalPages, 1);
    const normalizedPage = Math.min(Math.max(Math.floor(page), 1), safeTotalPages);
    const params = new URLSearchParams(searchParams.toString());

    params.set("type", activeType);
    params.set("page", String(normalizedPage));
    params.set("limit", String(limit));

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-16">
      <PageFooterPagination
        page={currentPage}
        totalPages={totalPages}
        onNext={() => goToPage(currentPage + 1)}
        onPrev={() => goToPage(currentPage - 1)}
        onPageChange={goToPage}
        labels={{
          page: t("pagination.page"),
          of: t("pagination.of"),
          prev: t("pagination.previous"),
          next: t("pagination.next"),
        }}
      />
    </div>
  );
}
