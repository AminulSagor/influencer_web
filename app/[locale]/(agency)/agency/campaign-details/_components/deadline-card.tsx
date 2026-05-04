import { Card, CardContent } from "@/components/ui/card";
import { FaClock } from "react-icons/fa";

interface Props {
  startingDate: string;
  duration: number;
}

const formatDate = (value: Date) => {
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const DeadlineCard = ({ startingDate, duration }: Props) => {
  const start = new Date(startingDate);
  const deadline = new Date(start);
  deadline.setDate(deadline.getDate() + duration);

  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const remainingDays = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);

  return (
    <Card className="overflow-hidden border-0 py-0">
      <CardContent className="p-0">
        <div className="flex min-h-[140px] flex-col justify-between rounded-xl bg-linear-to-r from-Primary to-light-green p-5 text-Secondary">
          <p className="flex items-center gap-2 text-base font-semibold">
            <FaClock className="size-4" />
            Deadline
          </p>

          <div>
            <h2 className="text-4xl font-bold leading-none sm:text-5xl">
              {remainingDays} Days
            </h2>
            <p className="mt-1 text-base font-medium">Remaining</p>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm font-medium sm:text-base">
            <p>{formatDate(deadline)}</p>
            <p>Duration: {duration} Days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeadlineCard;
