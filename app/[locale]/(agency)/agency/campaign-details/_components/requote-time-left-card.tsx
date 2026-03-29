import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IoIosHourglass } from "react-icons/io";

interface Props {
  timeLeftToRequoteMinutes: number;
  invitedAt?: string | null;
}

const formatTimeLeftToRequote = (minutes: number) => {
  const safeMinutes = Math.max(0, minutes);
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  return `${String(hours).padStart(2, "0")} H : ${String(
    remainingMinutes
  ).padStart(2, "0")} M`;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const RequoteTimeLeftCard = ({
  timeLeftToRequoteMinutes,
  invitedAt,
}: Props) => {
  const formattedInviteTime = formatDateTime(invitedAt);

  return (
    <Card className="gap-2 h-full justify-between">
      <CardHeader>
        <div className="flex justify-center">
          <IoIosHourglass size={60} className="text-orange" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <p className="text-orange text-4xl font-semibold">
            {formatTimeLeftToRequote(timeLeftToRequoteMinutes)}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-Primary text-center">
            Left to Requote
          </p>

          {formattedInviteTime ? (
            <p className="text-gray-500 text-center mx-auto text-xs">
              Request to requote within {formattedInviteTime}
            </p>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RequoteTimeLeftCard;