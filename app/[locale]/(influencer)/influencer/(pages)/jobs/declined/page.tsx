import { useTranslations } from "next-intl";
import DeclinedJobList from "../_components/declined-job-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";

const Page = () => {
  const t = useTranslations("influencer.jobs");

  return (
    <div className="space-y-8">
      <JobSearchBar
        title={t("declined.title")}
        resultText="Showing 2 of 10 results"
      />
      <DeclinedJobList />
    </div>
  );
};

export default Page;
