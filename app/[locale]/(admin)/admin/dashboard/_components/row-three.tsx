import React from "react";
import EarningOverviewCard from "./earning-overview-card";

const RowThree = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8">
        <EarningOverviewCard />
      </div>
      <div className="col-span-4"></div>
    </div>
  );
};

export default RowThree;
