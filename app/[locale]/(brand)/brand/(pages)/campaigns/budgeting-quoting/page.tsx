import { useTranslations } from "next-intl";
import CampaignSearchBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/campaign-search-bar";
import BudgetingAndQuotingList from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/budget-quoting";

const Page = () => {
  const t = useTranslations("influencer.jobs");
  return (
    <div className="space-y-8">
      <CampaignSearchBar
        title={t("active.title")}
        resultText="Showing 6 of 20 results"
      />
      <BudgetingAndQuotingList />
    </div>
  );
};

export default Page;
