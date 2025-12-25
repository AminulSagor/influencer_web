import ActionRequiredCard from "./action-required-card";
import QuickActionsCard from "./quick-actions-card";

const RowTwo = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8">
        <ActionRequiredCard />
      </div>
      <div className="col-span-4">
        <QuickActionsCard />
      </div>
    </div>
  );
};

export default RowTwo;
