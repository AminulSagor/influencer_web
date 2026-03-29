import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import InfoCard from "../../influencer/_components/info-card";
import ProfileCompletionCard from "../../influencer/_components/profile-completion-card";
import CampaignAcceptOrDeclinedCard from "../../influencer/_components/campaign-accept-declined-card";
import PayoutSettings from "../../influencer/_components/payout-setting";
import ProfileDetailsCard from "../../influencer/_components/profile-details-card";
import NidInfoCard from "../../influencer/_components/nid-info-card";
import BlockUserSection from "../../../_components/block-user-section";
import BlockedBanner from "../../../_components/blocked-banner";
import UserCampaignTable from "../../../_components/user-campaign-table";

import BrandTradeLicenseCard from "../../brand/_components/brand-trade-license-card";
import BrandTinCertificateCard from "../../brand/_components/brand-tin-certificate-card";
import BrandBinCard from "../../brand/_components/brand-bin-card";

import { getAgencyProfile } from "@/service/admin/users/get-agency-profile";
import { getUserCampaignList } from "@/service/admin/users/get-user-campaign-list";
import { getUserOverviewStats } from "@/service/admin/users/get-users-overview-stats";
import { getUserCompletion } from "@/service/admin/users/get-user-completion";

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

    const [agency, overviewStats, completion, campaignsRes] = await Promise.all([
        getAgencyProfile(id),
        getUserOverviewStats(id),
        getUserCompletion(id),
        getUserCampaignList({ 
            userId: id, 
            userType: "agency",
            tab,
            search,
            page: pageNum
        }),
    ]);

    if (!agency?.userId) {
        notFound();
    }

    const location = [agency.address?.zilla, "Bangladesh"].filter(Boolean).join(", ");

    const socialHandles = {
        instagram:
            agency.socialLinks.find(
                (item) => item.platform?.toLowerCase() === "instagram"
            )?.url || undefined,
        tiktok:
            agency.socialLinks.find(
                (item) => item.platform?.toLowerCase() === "tiktok"
            )?.url || undefined,
        twitter:
            agency.socialLinks.find(
                (item) =>
                    item.platform?.toLowerCase() === "twitter" ||
                    item.platform?.toLowerCase() === "x"
            )?.url || undefined,
    };

    const personalInfo = {
        firstName: agency.firstName,
        lastName: agency.lastName,
        phoneNumber: agency.phone,
        email: agency.email,
        location: location || "Bangladesh",
    };

    const nidInfo = {
        nidNumber: agency.nidNumber,
        frontSideImageUrl: agency.nidFrontImg,
        backSideImageUrl: agency.nidBackImg,
    };

    const payoutSettings = [
        ...(agency.payouts?.bank ?? []),
        ...(agency.payouts?.mobileBanking ?? []),
    ];

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
                    Browse User &gt; Agency &gt; {agency.agencyName || "Profile Details"}
                </p>
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6">
                    <InfoCard
                        location={location || "Bangladesh"}
                        name={agency.agencyName || "N/A"}
                        image={agency.logo}
                        role={agency.role}
                        socialHandles={socialHandles}
                        verifiedStatus={agency.isVerified ? "Verified" : "Unverified"}
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

            {agency.isBlocked && <BlockedBanner userId={id} />}

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
                        <div className="col-span-12 lg:col-span-6">
                            <ProfileCompletionCard
                                progress={completion.completionPercentage ?? 0}
                                bioText={agency.agencyBio}
                                niches={agency.niches}
                                skills={agency.website ? [agency.website] : []}
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

                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12 lg:col-span-8">
                                    <div className="border rounded-xl p-4 bg-white h-full">
                                        <h3 className="text-Primary font-semibold mb-3">Address</h3>
                                        <div className="text-sm text-muted-foreground">
                                            {[agency.address?.fullAddress, agency.address?.thana, agency.address?.zilla]
                                                .filter(Boolean)
                                                .join(", ") || "N/A"}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-4">
                                    <div className="border rounded-xl p-4 bg-linear-to-r from-white to-Secondary border-light-green h-full flex flex-col justify-center">
                                        <h3 className="text-sm font-medium text-Primary mb-2">
                                            Service Fee
                                        </h3>
                                        <p className="text-2xl font-semibold text-Primary">
                                            {agency.serviceFee ? `${agency.serviceFee}%` : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <NidInfoCard nidInfo={nidInfo} />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 lg:col-span-4">
                            <BrandTradeLicenseCard
                                tradeLicenseNumber={agency.tradeLicenseNumber}
                                tradeLicenseImage={agency.tradeLicenseImage}
                            />
                        </div>

                        <div className="col-span-12 lg:col-span-4">
                            <BrandTinCertificateCard
                                tinNumber={agency.tinNumber}
                                tinImage={agency.tinImage}
                            />
                        </div>

                        <div className="col-span-12 lg:col-span-4">
                            <BrandBinCard binNumber={agency.binNumber} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="campaigns" className="space-y-4 mt-4">
                    <UserCampaignTable 
                        initialData={campaignsRes?.data || []} 
                        meta={campaignsRes?.meta} 
                    />
                </TabsContent>
            </Tabs>

            {!agency.isBlocked && <BlockUserSection userId={id} />}
        </div>
    );
};

export default page;