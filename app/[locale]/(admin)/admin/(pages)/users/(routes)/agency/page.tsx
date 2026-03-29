import VerificationBreadcrumb from "../../_components/user-breadcrumb";
import VariantLinksCard from "../../_components/variants-links-card";
import AgencyUserCard from "../../_components/agency-user-card";
import { getAdminUserCounts } from "@/service/admin/users/get-users-counts";
import { getAllAgencies } from "@/service/admin/users/get-all-agencies";

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    status?: string;
    minRating?: string;
    minJobsDone?: string;
    minRevenue?: string;
    sortBy?: string;
    niche?: string;
  }>;
};

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams?.page ?? "1");
  const search = resolvedSearchParams?.search ?? "";
  const status = resolvedSearchParams?.status ?? "";
  const sortBy = resolvedSearchParams?.sortBy ?? "";
  const niche = resolvedSearchParams?.niche ?? "";

  const minRating = resolvedSearchParams?.minRating
    ? Number(resolvedSearchParams.minRating)
    : undefined;

  const minJobsDone = resolvedSearchParams?.minJobsDone
    ? Number(resolvedSearchParams.minJobsDone)
    : undefined;

  const minRevenue = resolvedSearchParams?.minRevenue
    ? Number(resolvedSearchParams.minRevenue)
    : undefined;

  const [counts, agencyRes] = await Promise.all([
    getAdminUserCounts(),
    getAllAgencies({
      page: currentPage,
      limit: 10,
      search,
      status,
      minRating,
      minJobsDone,
      minRevenue,
      sortBy,
      niche,
    }),
  ]);

  return (
    <div className="p-4 space-y-4">
      <VerificationBreadcrumb type="agency" name="" />
      <VariantLinksCard counts={counts} />
      <AgencyUserCard users={agencyRes.users} meta={agencyRes.meta} />
    </div>
  );
};

export default page;