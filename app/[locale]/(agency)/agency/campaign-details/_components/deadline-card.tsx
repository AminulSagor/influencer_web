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
    <Card className="h-full overflow-hidden border-0 py-0">
      <CardContent className="h-full p-0">
        <div className="flex min-h-[96px] h-full items-stretch justify-between rounded-xl bg-linear-to-r from-Primary to-light-green p-4 text-Secondary">
          <div className="flex flex-col justify-between">
            <p className="flex items-center gap-2 text-base font-semibold">
              <FaClock className="size-4" />
              Deadline
            </p>

            <div>
              <h2 className="text-4xl font-bold leading-none">
                {remainingDays} Days
              </h2>
              <p className="mt-1 text-sm font-medium">Remaining</p>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between text-right">
            <p className="text-base font-medium">{formatDate(deadline)}</p>
            <p className="text-sm font-medium">Duration: {duration} Days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeadlineCard;
