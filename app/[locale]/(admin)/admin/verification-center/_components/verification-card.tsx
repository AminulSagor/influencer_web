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
        "rounded-md px-4 py-3 space-y-4 cursor-pointer transition-all duration-500",
        isSelected
          ? "bg-linear-to-r from-Primary to-light-green text-white-two"
          : "bg-linear-to-r from-white to-Secondary border border-light-green text-Primary"
      )}
    >
      <h2 className="text-xl font-semibold">{label}</h2>

      <div className="flex items-center justify-between">
        <p>{count}</p>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default VerificationCard;
