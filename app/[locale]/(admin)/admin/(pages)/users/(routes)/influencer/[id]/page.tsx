import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";

import InfoCard from "../_components/info-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCompletionCard from "../_components/profile-completion-card";
import CampaignAcceptOrDeclinedCard from "../_components/campaign-accept-declined-card";
import PayoutSettings from "../_components/payout-setting";
import ProfileDetailsCard from "../_components/profile-details-card";
import NidInfoCard from "../_components/nid-info-card";
import DeliveryLocationCard from "../_components/delivery-location-card";
import CampaignTable from "../_components/campaign-table";

import { getInfluencerProfile } from "@/service/admin/users/get-influencer-profile";
import { getUserOverviewStats } from "@/service/admin/users/get-users-overview-stats";
import { getUserCompletion } from "@/service/admin/users/get-user-completion";

interface Props {
  params: Promise<{ id: string }>;
}

const formatMoney = (amount: number) => {
  return `৳${new Intl.NumberFormat("en-BD").format(amount || 0)}`;
};

const page = async ({ params }: Props) => {
  const { id } = await params;

  const [inf, overviewStats, completion] = await Promise.all([
    getInfluencerProfile(id),
    getUserOverviewStats(id),
    getUserCompletion(id),
  ]);

  if (!inf?.userId) {
    notFound();
  }

  const personalInfo = {
    firstName: inf.firstName,
    lastName: inf.lastName,
    phoneNumber: inf.phone,
    email: inf.email,
    location:
      inf.addresses?.[0]
        ? [inf.addresses[0].zilla, inf.addresses[0].country]
          .filter(Boolean)
          .join(", ")
        : "Bangladesh",
  };

  const nidInfo = {
    nidNumber: inf.nidNumber,
    frontSideImageUrl: inf.nidFrontImg,
    backSideImageUrl: inf.nidBackImg,
  };

  const payoutSettings = [
    ...(inf.payouts?.bank ?? []),
    ...(inf.payouts?.mobileBanking ?? []),
  ];

  const socialHandles = {
    instagram:
      inf.socialLinks.find((item) => item.platform?.toLowerCase() === "instagram")
        ?.url || undefined,
    tiktok:
      inf.socialLinks.find((item) => item.platform?.toLowerCase() === "tiktok")
        ?.url || undefined,
    twitter:
      inf.socialLinks.find(
        (item) =>
          item.platform?.toLowerCase() === "twitter" ||
          item.platform?.toLowerCase() === "x"
      )?.url || undefined,
  };

  const moneyMetric = overviewStats?.moneyMetric || "Total Revenue Generated";
  const moneyValue = overviewStats?.moneyValue ?? 0;
  const jobMetric = overviewStats?.jobMetric || "Total Job Done";
  const jobValue = overviewStats?.jobValue ?? 0;
  const activeJobValue = overviewStats?.activeJobValue ?? 0;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-Primary">Browse User</h1>
        <p className="text-sm text-muted-foreground">
          Browse User &gt; Influencer &gt; {inf.fullName || "Profile Details"}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">

          <InfoCard
            location={personalInfo.location || "Bangladesh"}
            name={inf.fullName || "N/A"}
            image={inf.profileImg}
            role={inf.role}
            socialHandles={socialHandles}
            verifiedStatus={inf.isVerified ? "Verified" : "Unverified"}
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
                    <h2 className="text-base font-medium">Active Jobs</h2>
                    <p className="font-semibold text-2xl">{activeJobValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="profile_details">
        <TabsList className="w-full bg-white rounded-full p-1 border">
          <TabsTrigger
            value="profile_details"
            className="flex-1 rounded-full data-[state=active]:bg-light-green data-[state=active]:text-white"
          >
            Profile Details
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 rounded-full data-[state=active]:bg-light-green data-[state=active]:text-white"
            value="campaigns"
          >
            Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile_details" className="space-y-4 mt-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6">
              <ProfileCompletionCard
                progress={completion.completionPercentage ?? 0}
                bioText={inf.bio}
                niches={inf.niches}
                skills={inf.skills}
                missingOrPendingSteps={completion.missingOrPendingSteps}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <CampaignAcceptOrDeclinedCard userId={id} />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4">
              <PayoutSettings payoutSettings={payoutSettings} />
            </div>

            <div className="col-span-12 lg:col-span-8 space-y-4">
              <ProfileDetailsCard personalInfo={personalInfo} />

              <NidInfoCard nidInfo={nidInfo} />

              <DeliveryLocationCard
                locations={(inf.addresses ?? []).map((address, index) => ({
                  id: `${address.addressName || "location"}-${index}`,
                  title: address.addressName || `Location ${index + 1}`,
                  address: [
                    address.fullAddress,
                    address.thana,
                    address.zilla,
                    address.country,
                  ]
                    .filter(Boolean)
                    .join(", "),
                }))}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4 mt-4">
          <CampaignTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;