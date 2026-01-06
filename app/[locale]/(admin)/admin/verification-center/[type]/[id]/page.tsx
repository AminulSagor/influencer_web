import { cn } from "@/lib/utils";
import { verificationTableData } from "../../_components/verification-data";
import ApprovalProgress from "./_components/approval-progress";
import DeliveryLocationCard from "./_components/delivery-location-card";
import InfoCard from "./_components/info-card";
import NicheCard from "./_components/niche-card";
import NidInfoCard from "./_components/nid-info-card";
import PayoutSettings from "./_components/payout-setting";
import ProfileCompletionCard from "./_components/profile-completion-card";
import ProfileDetailsCard from "./_components/profile-details-card";
import SkillsCard from "./_components/skills-card";
import SocialLinksCard from "./_components/social-links-card";

interface Props {
  params: Promise<{ type: string; id: string }>;
}

const page = async ({ params }: Props) => {
  const { type, id } = await params;
  const typeKey = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  const idNumber = Number(id);
  const dataForType =
    verificationTableData[typeKey as keyof typeof verificationTableData];
  const detail = dataForType?.find((item) => item.id === idNumber);
  if (!detail) {
    return <p>Verification data not found</p>;
  }

  const profile = detail.details?.profile;
  const niches = detail.details?.niches;
  const socialLinks = detail.details?.socialLinks;
  const skills = detail.details?.skills;
  const payoutSettings = detail.details?.payoutSettings || [];
  const nidInfo = detail.details?.nidInfo;
  const personalInfo = detail.details?.personalInfo;

  return (
    <div className="p-4 space-y-4">
      {/* row 1 */}
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 md:col-span-6 h-full">
          <InfoCard
            name={profile?.name ?? "N/A"}
            location={profile?.location ?? "N/A"}
            verifiedStatus="Unverified"
            socialHandles={profile?.socialHandles}
          />
        </div>
        <div className="col-span-12 md:col-span-6 h-full">
          <ProfileCompletionCard
            bioText={profile?.bio ?? "N/A"}
            progress={profile?.profileCompletionPercent ?? 0}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ApprovalProgress />
        </div>
      </div>

      {/* row 3 */}
      <div className="grid grid-cols-12 gap-4">
        <div
          className={cn(
            "col-span-12 md:col-span-4",
            typeKey !== "Influencer" && "md:col-span-6"
          )}
        >
          <NicheCard niches={niches ?? []} />
        </div>
        <div
          className={cn(
            "col-span-12 md:col-span-4",
            typeKey !== "Influencer" && "md:col-span-6"
          )}
        >
          <SocialLinksCard socialLinks={socialLinks ?? []} />
        </div>
        {typeKey === "Influencer" && (
          <div className="col-span-12 md:col-span-4">
            <SkillsCard skills={skills ?? []} />
          </div>
        )}
      </div>

      {/* row 4 */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <PayoutSettings payoutSettings={payoutSettings} />
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="space-y-4">
            <div>
              <NidInfoCard
                nidInfo={
                  nidInfo ?? {
                    nidNumber: "N/A",
                    backSideImageUrl: "",
                    frontSideImageUrl: "",
                  }
                }
              />
            </div>
            <div>
              <ProfileDetailsCard
                type={typeKey}
                personalInfo={
                  personalInfo ?? {
                    email: "N/A",
                    firstName: "N/A",
                    lastName: "N/A",
                    location: "N/A",
                    phoneNumber: "N/A",
                  }
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* row 5 */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <DeliveryLocationCard />
        </div>
      </div>
    </div>
  );
};

export default page;
