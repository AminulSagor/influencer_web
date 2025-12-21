import CompletedJobList from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/completed-job-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("influencer.jobs");

  return (
    <div className="space-y-8">
      <JobSearchBar
        title={t("completed.title")}
        resultText="Showing 6 of 20 results"
      />
      <CompletedJobList />
    </div>
  );
};

export default Page;
