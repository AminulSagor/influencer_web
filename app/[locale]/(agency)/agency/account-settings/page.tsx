import BasicInfoCard from "./_components/basic-info-card";
import NicheCard from "./_components/niche-card";
import ProfileCompletionCard from "./_components/profile-completion-card";
import ServiceFeeCard from "./_components/service-fee-card";
import SocialLinksCard from "./_components/social-links-card";

const page = () => {
  return (
    <div className="p-4 space-y-4">
      {/* row 1 */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <BasicInfoCard />
        </div>
        <div className="col-span-12 md:col-span-6">
          <ProfileCompletionCard />
        </div>
      </div>
      {/* row 2 */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <ServiceFeeCard />
        </div>
        <div className="col-span-12 md:col-span-4">
          <NicheCard />
        </div>
        <div className="col-span-12 md:col-span-4">
          <SocialLinksCard />
        </div>
      </div>
    </div>
  );
};

export default page;
