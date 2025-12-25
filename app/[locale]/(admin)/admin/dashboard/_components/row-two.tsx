import ActionRequiredCard from "./action-required-card";

const RowTwo = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-9">
        <ActionRequiredCard />
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};

export default RowTwo;
