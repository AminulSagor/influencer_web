import ActiveJobList from "../_components/active-job-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";

const page = () => {
  return (
    <div className="space-y-8">
      <JobSearchBar title="Active Job" resultText="Showing 6 of 20 results" />
      <ActiveJobList />
    </div>
  );
};

export default page;
