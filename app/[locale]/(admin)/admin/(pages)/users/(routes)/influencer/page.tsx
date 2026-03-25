import VerificationBreadcrumb from "../../_components/user-breadcrumb";
import VariantLinksCard from "../../_components/variants-links-card";
import UserCard from "../../_components/user-card";
import { getAdminUserCounts } from "@/service/admin/users/get-users-counts";
import { getAllInfluencers } from "@/service/admin/users/get-all-influencers";

type PageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

const page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page ?? "1");

  const [counts, influencerRes] = await Promise.all([
    getAdminUserCounts(),
    getAllInfluencers(currentPage, 10),
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