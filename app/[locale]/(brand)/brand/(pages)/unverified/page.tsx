import LaunchBannerCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/launch-banner-card";
import NeedHelpCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/need-help-card";
import ProfileCompletionCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/profile-completion-card";
import VerificationProgressCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/verification-progress-card";

export default function UnverifiedPage() {
  return (
    <div className="space-y-6">
      <LaunchBannerCard />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <VerificationProgressCard />
        <ProfileCompletionCard />
      </div>

      <NeedHelpCard />
    </div>
  );
}
