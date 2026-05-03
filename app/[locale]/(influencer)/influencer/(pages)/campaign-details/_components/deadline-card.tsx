import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { FaClock } from "react-icons/fa";

interface DeadlineCardProps {
  startingDate: string;
  duration: number;
}

const DeadlineCard = ({ startingDate, duration }: DeadlineCardProps) => {
  const t = useTranslations("influencer.campaign-details");

  const endDate = new Date(startingDate);
  endDate.setDate(endDate.getDate() + duration);
  const now = new Date();
  const daysRemaining = Math.max(
    0,
    Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  const endDateLabel = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <Card className="flex flex-1 flex-col justify-between bg-linear-to-r from-Primary to-light-green p-5 text-Secondary shadow-md">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-Secondary">
          <FaClock />
          {t("Deadline")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 py-2">
        <h2 className="text-4xl font-bold leading-none text-Secondary">
          {daysRemaining} {t("Days")}
        </h2>
        <p className="mt-1 text-sm font-medium text-Secondary">
          {t("Remaining")}
        </p>
      </CardContent>

      <div className="flex justify-between gap-3 text-sm text-Secondary">
        <p>{endDateLabel}</p>
        <p>
          Duration: {duration} {t("Days")}
        </p>
      </div>
    </Card>
  );
};

export default DeadlineCard;
