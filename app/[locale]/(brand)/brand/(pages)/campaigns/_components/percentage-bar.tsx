const PercentageBar = ({ value }: { value: number }) => {
  return (
    <div className="w-full space-y-3">
      <div className="h-2 w-full rounded-full bg-light-green/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-light-green transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-medium text-muted-foreground">
        <p className="text-sm text-orange">{value}% Complete</p>
      </div>
    </div>
  );
};

export default PercentageBar;
