import ProfileSummaryCard from "./_components/profile-summary-card";
import ProfileCompletionCard from "./_components/profile-completion-card";
import SkillsCard from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/skills-card";
import NichesCard from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/niches-card";
import SocialLinksCard from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/social-links-card";
import ProfileEditCard from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/profile-edit-card";
import YourLocationsCard from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/your-locations-card";
import PayoutSettingsCard from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/payout-settings-card";
import VerificationMethodsCard from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/_components/verification-methods-card";

export default function AccountSettingsPage() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <ProfileSummaryCard />

        {/* Right */}
        <ProfileCompletionCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <SkillsCard />
        <NichesCard />
        <SocialLinksCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left column */}
        <div className="lg:col-span-8">
          <div className="flex flex-col gap-4">
            <ProfileEditCard />
            <YourLocationsCard />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4">
          <PayoutSettingsCard />
        </div>
      </div>
      <div className="mt-6">
        <VerificationMethodsCard />
      </div>
    </div>
  );
}
