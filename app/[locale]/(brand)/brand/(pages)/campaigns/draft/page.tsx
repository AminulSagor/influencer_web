import { useTranslations } from "next-intl";
import PendingJobList from "../_components/campaign-draft-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";

const Page = () => {
  const t = useTranslations("influencer.jobs");

  return (
    <div className="space-y-8">
      <JobSearchBar
        title={t("pending.title")}
        resultText="Showing 3 of 8 results"
      />
      <PendingJobList />
    </div>
  );
};

export default Page;
