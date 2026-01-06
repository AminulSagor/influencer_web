import ActionRequiredCard from "./action-required-card";
import QuickActionsCard from "./quick-actions-card";
import RecentActivityCard from "./recent-activity-card";

const RowTwo = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8">
        <ActionRequiredCard />
      </div>
      <div className="col-span-4">
        <div className="space-y-4">
          <QuickActionsCard />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
};

export default RowTwo;
