import BrandAssetsCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/brand-assets-card";
import InformationCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/info-card";
import ProfileCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/profile-card";
import ProfileUpdateCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/profile-update-card";
import VerificationMethodsCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/verification-methods-card";
import BrandDeleteAccountSection from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/brand-delete-account-section";
import NicheCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/niche-card";
import AccountSettingsNotificationRefresh from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/account-settings-notification-refresh";

const AccountSettingsPage = () => {
  return (
    <div className="space-y-4">
      <AccountSettingsNotificationRefresh />
      <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
        <ProfileCard />
        <InformationCard />
      </div>

      {/* assets card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4">
          <NicheCard />
        </div>
        <div className="lg:col-span-8">
          <BrandAssetsCard />
        </div>
      </div>

      {/* profile update card */}
      <ProfileUpdateCard />

      {/* verification */}
      <VerificationMethodsCard />

      <BrandDeleteAccountSection />
    </div>
  );
};

export default AccountSettingsPage;
