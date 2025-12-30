import { useTranslations } from "next-intl";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";
import CampaignDraftList from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/campaign-draft-list";

const Page = () => {
  const t = useTranslations("influencer.jobs");

  return (
    <div className="space-y-8">
      <JobSearchBar
        title={t("pending.title")}
        resultText="Showing 3 of 8 results"
      />
      <CampaignDraftList />
    </div>
  );
};

export default Page;
