import VerificationBreadcrumb from "../../_components/user-breadcrumb";
import VariantLinksCard from "../../_components/variants-links-card";
import UserCard from "../../_components/user-card";
import { getAdminUserCounts } from "@/service/admin/users/get-users-counts";
import { getAllInfluencers } from "@/service/admin/users/get-all-influencers";

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    status?: string;
    niche?: string;
    minRating?: string;
    minJobsDone?: string;
    minRevenue?: string;
    view?: string;
  }>;
};

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams?.page ?? "1");
  const search = resolvedSearchParams?.search ?? "";
  const status = resolvedSearchParams?.status ?? "";
  const niche = resolvedSearchParams?.niche ?? "";
  const view = resolvedSearchParams?.view === "grid" ? "grid" : "list";

  const minRating = resolvedSearchParams?.minRating
    ? Number(resolvedSearchParams.minRating)
    : undefined;

  const minJobsDone = resolvedSearchParams?.minJobsDone
    ? Number(resolvedSearchParams.minJobsDone)
    : undefined;

  const minRevenue = resolvedSearchParams?.minRevenue
    ? Number(resolvedSearchParams.minRevenue)
    : undefined;

  const [counts, influencerRes] = await Promise.all([
    getAdminUserCounts(),
    getAllInfluencers({
      page: currentPage,
      limit: view === "grid" ? 12 : 10,
      search,
      status,
      niche,
      minRating,
      minJobsDone,
      minRevenue,
    }),
  ]);

  return (
    <div className="p-4 space-y-4">
      <VerificationBreadcrumb type="influencer" name="" />
      <VariantLinksCard counts={counts} />
      <UserCard users={influencerRes.users} meta={influencerRes.meta} />
    </div>
  );
};

export default page;
