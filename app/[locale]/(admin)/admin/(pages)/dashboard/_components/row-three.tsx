import React from "react";
import EarningOverviewCard from "./earning-overview-card";
import CampaignAcceptOrDeclinedCard from "./campaign-accept-declined-card";

const RowThree = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-8">
        <EarningOverviewCard />
      </div>
      <div className="col-span-12 md:col-span-4">
        <CampaignAcceptOrDeclinedCard />
      </div>
    </div>
  );
};

export default RowThree;
