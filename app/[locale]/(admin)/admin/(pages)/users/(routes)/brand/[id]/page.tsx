import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getBrandProfile } from "@/service/admin/users/get-brand-profile";
import { getUserOverviewStats } from "@/service/admin/users/get-users-overview-stats";
import { getUserCompletion } from "@/service/admin/users/get-user-completion";
import { getUserCampaignList } from "@/service/admin/users/get-user-campaign-list";

import BrandProfileCompletionCard from "../_components/brand-profile-completion-card";
import BrandCampaignStatusCard from "../_components/brand-campaign-status-card";
import BrandPayoutSettingsCard from "../_components/brand-payout-settings-card";
import BrandProfileDetailsCard from "../_components/brand-profile-details-card";
import BrandNidInfoCard from "../_components/brand-nid-info-card";
import BrandTradeLicenseCard from "../_components/brand-trade-license-card";
import BrandTinCertificateCard from "../_components/brand-tin-certificate-card";
import BrandBinCard from "../_components/brand-bin-card";
import BrandInfoCard from "../_components/brand-info-card";
import BlockUserSection from "../../../_components/block-user-section";
import BlockedBanner from "../../../_components/blocked-banner";
import UserCampaignTable from "../../../_components/user-campaign-table";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const formatMoney = (amount: number) => {
  return `৳${new Intl.NumberFormat("en-BD").format(amount || 0)}`;
};

const page = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const sParams = await searchParams;

  const tab = (sParams.tab as any) || "all";
  const search = (sParams.search as string) || undefined;
  const pageNum = Number(sParams.page) || 1;

  const [brand, overviewStats, completion, campaignsRes] = await Promise.all([
    getBrandProfile(id),
    getUserOverviewStats(id),
    getUserCompletion(id),
    getUserCampaignList({ 
      userId: id, 
      userType: "client",
      tab,
      search,
      page: pageNum
    }),
  ]);

  if (!brand?.id) {
    notFound();
  }

  const location = [brand.thana, brand.zilla, brand.country]
    .filter(Boolean)
    .join(", ");

  const moneyMetric = overviewStats?.moneyMetric || "Total Spent So Far";
  const moneyValue = overviewStats?.moneyValue ?? 0;
  const jobMetric = overviewStats?.jobMetric || "Total Job Placed";
  const jobValue = overviewStats?.jobValue ?? 0;
  const activeJobValue = overviewStats?.activeJobValue ?? 0;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-Primary">Browse User</h1>
        <p className="text-sm text-muted-foreground">
          Browse User &gt; Brand &gt; {brand.brandName || "Profile"}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">
          <BrandInfoCard
            name={brand.brandName || "N/A"}
            location={location || "Bangladesh"}
            image={brand.profileImg}
            socialLinks={brand.socialLinks}
            verifiedStatus={brand.isVerified ? "Verified" : "Unverified"}
          />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <Card className="h-full">
            <div className="p-4 space-y-3">
              <div className="border p-4 rounded-md bg-linear-to-r from-white to-Secondary border-light-green">
                <div className="space-y-2 text-Primary">
                  <h2 className="text-base font-medium">{moneyMetric}</h2>
                  <p className="font-semibold text-2xl">
                    {formatMoney(moneyValue)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border p-4 rounded-md bg-linear-to-r from-white to-Secondary border-light-green">
                  <div className="space-y-2 text-Primary">
                    <h2 className="text-base font-medium">{jobMetric}</h2>
                    <p className="font-semibold text-2xl">{jobValue}</p>
                  </div>
                </div>

                <div className="border p-4 rounded-md bg-linear-to-r from-white to-orange/10 border-orange">
                  <div className="space-y-2 text-orange">
                    <h2 className="text-base font-medium">Active Job</h2>
                    <p className="font-semibold text-2xl">{activeJobValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {brand.isBlocked && <BlockedBanner userId={id} />}

      <Tabs defaultValue="profile_details">
        <TabsList className="w-full bg-white rounded-full p-1 border">
          <TabsTrigger
            value="profile_details"
            className="flex-1 rounded-full data-[state=active]:bg-light-green data-[state=active]:text-white"
          >
            Profile Details
          </TabsTrigger>
          <TabsTrigger
            value="campaigns"
            className="flex-1 rounded-full data-[state=active]:bg-light-green data-[state=active]:text-white"
          >
            Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile_details" className="space-y-4 mt-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8">
              <BrandProfileCompletionCard
                progress={completion.completionPercentage ?? 0}
                niches={brand.website ? [brand.website] : []}
              />
            </div>

            <div className="col-span-12 lg:col-span-4">
              <BrandCampaignStatusCard userId={id} />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4">
              <BrandPayoutSettingsCard />
            </div>

            <div className="col-span-12 lg:col-span-8 space-y-4">
              <BrandProfileDetailsCard
                ownerInfo={{
                  firstName: brand.firstName,
                  lastName: brand.lastName,
                }}
                contactInfo={{
                  email: brand.email,
                  phone: brand.phone,
                  secondaryPhone: brand.phone,
                }}
                address={{
                  title: "Address",
                  value: [brand.fullAddress, brand.thana, brand.zilla, brand.country]
                    .filter(Boolean)
                    .join(", "),
                }}
                serviceFee="N/A"
              />

              <BrandNidInfoCard
                nidNumber={brand.nidNumber}
                frontImage={brand.nidFrontImg}
                backImage={brand.nidBackImg}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4">
              <BrandTradeLicenseCard
                tradeLicenseNumber={brand.tradeLicenseNumber}
                tradeLicenseImage={brand.tradeLicenseImg}
              />
            </div>

            <div className="col-span-12 lg:col-span-4">
              <BrandTinCertificateCard
                tinNumber={brand.tinNumber}
                tinImage={brand.tinImage}
              />
            </div>

            <div className="col-span-12 lg:col-span-4">
              <BrandBinCard binNumber={brand.binNumber} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-4">
          <UserCampaignTable 
            initialData={campaignsRes?.data || []} 
            meta={campaignsRes?.meta} 
          />
        </TabsContent>
      </Tabs>

      {!brand.isBlocked && <BlockUserSection userId={id} />}
    </div>
  );
};

export default page;