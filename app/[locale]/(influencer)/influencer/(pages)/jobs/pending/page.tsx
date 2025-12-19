import PendingJobList from "../_components/pending-job-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";

const page = () => {
  return (
    <div className="space-y-8">
      <JobSearchBar
        title="Pending Payments"
        resultText="Showing 3 of 8 results"
      />
      <PendingJobList />
    </div>
  );
};

export default page;
