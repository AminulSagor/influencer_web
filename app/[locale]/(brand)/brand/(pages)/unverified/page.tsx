import { cookies } from "next/headers";
import LaunchBannerCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/launch-banner-card";
import NeedHelpCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/need-help-card";
import ProfileCompletionCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/profile-completion-card";
import VerificationProgressCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/verification-progress-card";
import { decodeJwtPayload } from "@/storage/jwt_decoder";

export default async function UnverifiedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role;

  return (
    <div className="space-y-6">
      <LaunchBannerCard />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <VerificationProgressCard role={role} />
        <ProfileCompletionCard />
      </div>

      <NeedHelpCard />
    </div>
  );
}