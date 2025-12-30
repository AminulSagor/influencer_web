import { useTranslations } from "next-intl";
import CampaignSearchBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/campaign-search-bar";
import CancelCampaignList from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/cancel-campaign-list";

const Page = () => {
  const t = useTranslations("brand.campaigns");

  return (
    <div className="space-y-8">
      <CampaignSearchBar
        title={t("Cancelled.title")}
        resultText="Showing 2 of 10 results"
      />
      <CancelCampaignList />
    </div>
  );
};

export default Page;
