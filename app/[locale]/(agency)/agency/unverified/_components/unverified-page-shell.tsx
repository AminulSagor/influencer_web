import { AgencyProfileResponse } from "@/types/agency/profile";

import { CompleteProfileCard } from "./complete-profile-card";
import { LaunchBannerCard } from "./launch-banner-card";
import { NeedHelpCard } from "./need-help-card";
import { VerificationProgressCard } from "./verification-progress-card";

type UnverifiedPageShellProps = {
  profile: AgencyProfileResponse | null;
};

export function UnverifiedPageShell({ profile }: UnverifiedPageShellProps) {
  return (
    <main className="space-y-4 px-4 py-4 sm:px-6 lg:px-8">
      <LaunchBannerCard />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2 items-start">
        <VerificationProgressCard profile={profile} />
        <CompleteProfileCard profile={profile} />
      </section>

      <NeedHelpCard />
    </main>
  );
}
