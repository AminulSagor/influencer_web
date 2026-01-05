import { verificationTableData } from "../../_components/verification-data";
import InfoCard from "./_components/info-card";
import NicheCard from "./_components/niche-card";
import PayoutSettings from "./_components/payout-setting";
import ProfileCompletionCard from "./_components/profile-completion-card";
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

      {/* row 3 */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <NicheCard niches={niches ?? []} />
        </div>
        <div className="col-span-12 md:col-span-4">
          <SocialLinksCard socialLinks={socialLinks ?? []} />
        </div>
        <div className="col-span-12 md:col-span-4">
          <SkillsCard skills={skills ?? []} />
        </div>
      </div>

      {/* row 4 */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <PayoutSettings payoutSettings={payoutSettings} />
        </div>
        <div className="col-span-12 md:col-span-8"></div>
      </div>
    </div>
  );
};

export default page;
