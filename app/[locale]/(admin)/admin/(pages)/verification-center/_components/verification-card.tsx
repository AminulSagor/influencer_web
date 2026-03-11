import { cn } from "@/lib/utils";

interface Props {
  label: string;
  count: number;
  status: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const VerificationCard = ({
  status,
  count,
  label,
  isSelected,
  onClick,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-[18px] border px-7 py-5 transition-all duration-300",
        isSelected
          ? "border-transparent bg-gradient-to-r from-Primary to-light-green text-white"
          : "border-light-green bg-gradient-to-r from-white to-Secondary text-Primary"
      )}
    >
      <h2 className="text-[18px] font-medium">{label}</h2>

      <div className="mt-8 flex items-end justify-between">
        <p className="text-[20px] font-bold">{count}</p>
        <p
          className={cn(
            "text-[14px]",
            isSelected ? "text-white" : "text-light-green"
          )}
        >
          {status}
        </p>
      </div>
    </div>
  );
};

export default VerificationCard;