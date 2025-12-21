import { useTranslations } from "next-intl";
import DeclinedJobList from "../_components/cancel-campaign-list";
import CampaignSearchBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/campaign-search-bar";

const Page = () => {
  const t = useTranslations("brand.campaigns");

  return (
    <div className="space-y-8">
      <CampaignSearchBar
        title={t("Cancelled.title")}
        resultText="Showing 2 of 10 results"
      />
      <DeclinedJobList />
    </div>
  );
};

export default Page;
