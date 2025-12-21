import { useTranslations } from "next-intl";
import CampaignSearchBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/campaign-search-bar";
import ActiveCampaignsList from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/active-campaigns-list";

const Page = () => {
  const t = useTranslations("brand.campaigns");

  return (
    <div className="space-y-8">
      <CampaignSearchBar
        title={t("active.title")}
        resultText="Showing 5 of 12 results"
        placeholder={t("Search By Job name, client name")}

      />
      <ActiveCampaignsList />
    </div>
  );
};

export default Page;
