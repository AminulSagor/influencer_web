import DeclinedJobList from "../_components/declined-job-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";

const page = () => {
  return (
    <div className="space-y-8">
      <JobSearchBar
        title="Declined Jobs"
        resultText="Showing 2 of 10 results"
      />
      <DeclinedJobList />
    </div>
  );
};

export default page;
