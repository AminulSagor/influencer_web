interface Props {
  title: string;
  minPaid: number;
  maxPaid: number;
  progressPercent: number;
}

const ProgressBar = ({ maxPaid, minPaid, progressPercent, title }: Props) => {
  return (
    <div className="px-2">
      <div className=" flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-sm font-semibold text-Primary"> ch
            {minPaid} of {maxPaid} Paid
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-light-green rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
