import CompletedJobList from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/completed-job-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";

const page = () => {
  return (
    <div className="space-y-8">
      <JobSearchBar
        title="Completed Jobs"
        resultText="Showing 6 of 20 results"
      />
      <CompletedJobList />
    </div>
  );
};

export default page;
