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
    <Card className="bg-linear-to-r from-Primary to-light-green justify-between">
      <CardHeader>
        <CardTitle className="text-Secondary flex items-center gap-2">
          <FaClock />
          {t("Deadline")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-Secondary text-5xl font-bold">
          {daysRemaining} {t("Days")}
        </h2>
        <p className="text-Secondary ml-1 text-sm font-medium mt-1">
          {t("Remaining")}
        </p>
      </CardContent>
      <div className="px-6">
        <div className="flex justify-between">
          <p className="text-sm text-Secondary">{endDateLabel}</p>
          <p className="text-sm text-Secondary">
            {t("Remaining")}: {duration} {t("Days")}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DeadlineCard;
