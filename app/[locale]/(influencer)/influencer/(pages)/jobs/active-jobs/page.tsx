import { useTranslations } from "next-intl";
import ActiveJobList from "../_components/active-job-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";

const Page = () => {
  const t = useTranslations("influencer.jobs");
  return (
    <div className="space-y-8">
      <JobSearchBar
        title={t("active.title")}
        resultText="Showing 6 of 20 results"
      />
      <ActiveJobList />
    </div>
  );
};

export default Page;
