import AgencyExploreSection from "@/app/[locale]/(brand)/brand/(pages)/explore/_components/agency-explore-section";
import ExploreHeader from "@/app/[locale]/(brand)/brand/(pages)/explore/_components/explore-header";
import ExploreTabs from "@/app/[locale]/(brand)/brand/(pages)/explore/_components/explore-tabs";
import InfluencerExploreSection from "@/app/[locale]/(brand)/brand/(pages)/explore/_components/influencer-explore-section";
import {
  ExploreSearchParams,
  ExploreType,
  ExplorePagination as ExplorePaginationType,
} from "@/app/[locale]/(brand)/brand/(pages)/explore/explore-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAgencies, getInfluencers } from "@/service/client/users";

type PageProps = {
  searchParams: Promise<ExploreSearchParams>;
};

const DEFAULT_LIMIT = 10;

export default async function ExplorePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const type = resolveType(params.type);
  const { page, limit } = resolvePagination(params.page, params.limit);

  if (type === "ad-agencies") {
    const response = await getAgencies(page, limit);
    const agencies = response.data ?? [];
    const meta = response.meta;

    const currentCount = agencies.length;
    const total = meta?.total ?? currentCount;
    const totalPages = resolveTotalPages(
      total,
      meta?.limit ?? limit,
      meta?.totalPages,
    );

    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <ExploreHeader />
            <ExploreTabs activeType={type} />
          </div>
        </CardHeader>

        <div className="w-full border border-light-gray" />

        <CardContent className="space-y-4">
          <AgencyExploreSection
            agencies={agencies}
            total={total}
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
            activeType={type}
          />
        </CardContent>
      </Card>
    );
  }

  const response = await getInfluencers(page, limit);
  const influencers = response.data ?? [];
  const meta = response.meta;

  const currentCount = influencers.length;
  const total = meta?.total ?? currentCount;
  const totalPages = resolveTotalPages(
    total,
    meta?.limit ?? limit,
    meta?.totalPages,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <ExploreHeader />
          <ExploreTabs activeType={type} />
        </div>
      </CardHeader>

      <div className="w-full border border-light-gray" />

      <CardContent className="space-y-4">
        <InfluencerExploreSection
          influencers={influencers}
          total={total}
          currentPage={page}
          totalPages={totalPages}
          limit={limit}
          activeType={type}
        />
      </CardContent>
    </Card>
  );
}

function resolveType(type?: string): ExploreType {
  return type === "ad-agencies" ? "ad-agencies" : "influencer";
}

function resolvePagination(
  page?: string,
  limit?: string,
): ExplorePaginationType {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  return {
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    limit:
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? parsedLimit
        : DEFAULT_LIMIT,
  };
}

function resolveTotalPages(
  total = 0,
  limit = DEFAULT_LIMIT,
  totalPages?: number,
) {
  if (typeof totalPages === "number" && totalPages > 0) {
    return totalPages;
  }

  return Math.max(1, Math.ceil(total / limit));
}
