import { useTranslations } from "next-intl";
import NewOfferList from "./_components/new-offer-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";

const Page = () => {
  const t = useTranslations("influencer.jobs");

  return (
    <div className="space-y-8">
      <JobSearchBar
        title={t("newOffer.title")}
        resultText="Showing 5 of 12 results"
      />
      <NewOfferList />
    </div>
  );
};

export default Page;
