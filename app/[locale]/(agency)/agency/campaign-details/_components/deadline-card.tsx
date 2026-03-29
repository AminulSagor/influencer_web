import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="bg-linear-to-r from-Primary to-light-green h-full justify-between">
      <CardHeader>
        <CardTitle className="text-Secondary flex items-center gap-2">
          <FaClock />
          Deadline
        </CardTitle>
      </CardHeader>

      <CardContent>
        <h2 className="text-Secondary text-5xl font-bold">
          {remainingDays} Days
        </h2>
        <p className="text-Secondary ml-1 text-sm font-medium mt-1">
          Remaining
        </p>
      </CardContent>

      <div className="px-6">
        <div className="flex justify-between">
          <p className="text-sm text-Secondary">{formatDate(deadline)}</p>
          <p className="text-sm text-Secondary">Duration: {duration} Days</p>
        </div>
      </div>
    </Card>
  );
};

export default DeadlineCard;