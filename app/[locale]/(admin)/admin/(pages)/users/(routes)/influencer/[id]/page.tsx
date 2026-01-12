import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { userData } from "../../../_components/user-data";
import InfoCard from "../_components/info-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCompletionCard from "../_components/profile-completion-card";
import CampaignAcceptOrDeclinedCard from "../_components/campaign-accept-declined-card";
import PayoutSettings from "../_components/payout-setting";
import ProfileDetailsCard from "../_components/profile-details-card";
import NidInfoCard from "../_components/nid-info-card";
import DeliveryLocationCard from "../_components/delivery-location-card";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;
  const data = userData["influencer"];
  const inf = data.find((d) => d.id === Number(id));

  const personalInfo = {
    firstName: inf?.profile.profileDetails.firstName!,
    lastName: inf?.profile.profileDetails.lastName!,
    phoneNumber: inf?.profile.profileDetails.phone!,
    email: inf?.profile.profileDetails.email!,
    location: "Dhaka, Bangladesh",
  };

  const nidInfo = {
    ...inf?.profile.nidInfo!,
  };

  return (
    <div className="p-4 space-y-2">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <InfoCard
            location="Dhaka, Bangladesh"
            name={inf?.name!}
            socialHandles={{
              instagram: "hahnia amir",
              tiktok: "Hania",
              twitter: "yo",
            }}
            verifiedStatus="Unverified"
          />
        </div>
        <div className="col-span-6">
          <Card>
            <div className="px-4 space-y-2">
              <div className="border p-4 rounded-md bg-linear-to-r from-white to-Secondary border-light-green">
                <div className="space-y-2 text-Primary">
                  <h2 className="text-xl">Total Revenue Generated</h2>
                  <p className="font-semibold text-lg">৳5,25,000</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="border p-4 rounded-md bg-linear-to-r from-white to-Secondary border-light-green flex-1">
                  <div className="space-y-2 text-Primary">
                    <h2 className="text-lg">Total Job Done</h2>
                    <p className="font-semibold text-lg">{inf?.jobDone}</p>
                  </div>
                </div>
                <div className="border p-4 rounded-md bg-linear-to-r from-white to-Secondary border-light-green flex-1">
                  <div className="space-y-2 text-orange">
                    <h2 className="text-lg">Active Jobs</h2>
                    <p className="font-semibold text-lg">{inf?.activeJobs}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div>
        <Tabs defaultValue="profile_details">
          <TabsList className="w-full bg-white">
            <TabsTrigger
              value="profile_details"
              className="data-[state=active]:bg-light-green data-[state=active]:text-white"
            >
              Profile Details
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-light-green data-[state=active]:text-white"
              value="campaigns"
            >
              Campaigns
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile_details" className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <ProfileCompletionCard
                  progress={70}
                  bioText={inf?.profile.basicInfo.bio!}
                  niches={inf?.profile.basicInfo.niches!}
                  skills={inf?.profile.basicInfo.skills!}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <CampaignAcceptOrDeclinedCard />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <PayoutSettings payoutSettings={inf?.profile.payoutSettings!} />
              </div>
              <div className="col-span-12 md:col-span-8 space-y-4">
                <div>
                  <ProfileDetailsCard personalInfo={personalInfo!} />
                </div>
                <div>
                  <NidInfoCard nidInfo={nidInfo} />
                </div>
                <div>
                  <DeliveryLocationCard />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="campaigns" className="space-y-4">
            <div>
             
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
