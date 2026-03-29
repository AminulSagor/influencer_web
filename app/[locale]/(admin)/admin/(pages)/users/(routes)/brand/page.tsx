import VerificationBreadcrumb from "../../_components/user-breadcrumb";
import VariantLinksCard from "../../_components/variants-links-card";
import BrandUserCard from "../../_components/brand-user-card";
import { getAdminUserCounts } from "@/service/admin/users/get-users-counts";
import { getAllBrands } from "@/service/admin/users/get-all-brands";

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    status?: string;
    minJobsPlaced?: string;
    minSpent?: string;
    sortBy?: string;
  }>;
};

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const currentPage = Number(resolvedSearchParams?.page ?? "1");
  const search = resolvedSearchParams?.search ?? "";
  const status = resolvedSearchParams?.status ?? "";
  const sortBy = resolvedSearchParams?.sortBy ?? "";

  const minJobsPlaced = resolvedSearchParams?.minJobsPlaced
    ? Number(resolvedSearchParams.minJobsPlaced)
    : undefined;

  const minSpent = resolvedSearchParams?.minSpent
    ? Number(resolvedSearchParams.minSpent)
    : undefined;

  const [counts, brandRes] = await Promise.all([
    getAdminUserCounts(),
    getAllBrands({
      page: currentPage,
      limit: 10,
      search,
      status,
      minJobsPlaced,
      minSpent,
      sortBy,
    }),
  ]);

  return (
    <div className="p-4 space-y-4">
      <VerificationBreadcrumb type="brand" name="" />
      <VariantLinksCard counts={counts} />
      <BrandUserCard users={brandRes.users} meta={brandRes.meta} />
    </div>
  );
};

export default page;