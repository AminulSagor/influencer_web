import VerificationBreadcrumb from "./_components/verification-breadcrumb";
import VerificationCardsContainer from "./_components/verification-card-container";
import {
  getPendingVerificationAgencies,
  getPendingVerificationBrands,
  getPendingVerificationInfluencers,
  type VerificationCardDataType,
  type VerificationTableData,
  type VerificationTableMeta,
} from "@/service/admin/verification-center/get-pending-profiles";

interface Props {
  searchParams: Promise<{
    tab?: string;
    page?: string;
    search?: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const currentTab =
    params.tab === "brand" ||
    params.tab === "agency" ||
    params.tab === "influencer"
      ? params.tab
      : "influencer";

  const currentPage = Math.max(Number(params.page || "1"), 1);
  const currentSearch = params.search?.trim() ?? "";
  const agencyPage = currentTab === "agency" ? currentPage : 1;
  const brandPage = currentTab === "brand" ? currentPage : 1;
  const influencerPage = currentTab === "influencer" ? currentPage : 1;

  const [agencyRes, brandRes, influencerRes] = await Promise.all([
    getPendingVerificationAgencies({
      page: agencyPage,
      limit: 10,
      search: currentTab === "agency" ? currentSearch : "",
    }),
    getPendingVerificationBrands({
      page: brandPage,
      limit: 10,
      search: currentTab === "brand" ? currentSearch : "",
    }),
    getPendingVerificationInfluencers({
      page: influencerPage,
      limit: 10,
      search: currentTab === "influencer" ? currentSearch : "",
    }),
  ]);

  const verificationData: VerificationCardDataType[] = [
    {
      id: 1,
      label: "Influencer",
      count: influencerRes.meta?.total ?? 0,
      status: "Pending",
      key: "influencer",
    },
    {
      id: 2,
      label: "Agency",
      count: agencyRes.meta?.total ?? 0,
      status: "Pending",
      key: "agency",
    },
    {
      id: 3,
      label: "Brand",
      count: brandRes.meta?.total ?? 0,
      status: "Pending",
      key: "brand",
    },
  ];

  const verificationTableData: VerificationTableData = {
    Influencer: influencerRes.data.map((item) => ({
      id: item.userId,
      name: item.fullName,
      niche: item.niches ?? [],
      pendingItems: item.pendingItemsCount ?? 0,
      approvalProgress: item.approvalProgress ?? 0,
      isVerified: item.isVerified ?? false,
      email: item.email,
      phone: item.phone,
    })),
    Brand: brandRes.data.map((item) => ({
      id: item.userId,
      name: item.brandName,
      niche: [],
      pendingItems: item.pendingItemsCount ?? 0,
      approvalProgress: item.approvalProgress ?? 0,
      isVerified: item.isVerified ?? false,
      email: item.email,
      phone: item.phone,
    })),
    Agency: agencyRes.data.map((item) => ({
      id: item.userId,
      name: item.agencyName,
      niche: item.niches ?? [],
      pendingItems: item.pendingItemsCount ?? 0,
      approvalProgress: item.approvalProgress ?? 0,
      isVerified: item.isVerified ?? false,
      email: item.email,
      phone: item.phone,
    })),
  };

  const verificationTableMeta: VerificationTableMeta = {
    Influencer: influencerRes.meta,
    Brand: brandRes.meta,
    Agency: agencyRes.meta,
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        <VerificationBreadcrumb />
        <VerificationCardsContainer
          verificationData={verificationData}
          verificationTableData={verificationTableData}
          verificationTableMeta={verificationTableMeta}
          currentTab={currentTab}
          currentSearch={currentSearch}
        />
      </div>
    </div>
  );
};

export default page;