import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaClock } from "react-icons/fa";

const DeadlineCard = () => {
  return (
    <Card className="bg-linear-to-r from-Primary to-light-green justify-between">
      <CardHeader>
        <CardTitle className="text-Secondary flex items-center gap-2">
          <FaClock />
          Deadline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-Secondary text-5xl font-bold">4 Days</h2>
        <p className="text-Secondary ml-1 text-sm font-medium mt-1">
          Remaining
        </p>
      </CardContent>
      <div className="px-6">
        <div className="flex  justify-between">
          <p className="text-sm text-Secondary">Dec 15, 2025</p>
          <p className="text-sm text-Secondary">Duration: 14 Days</p>
        </div>
      </div>
    </Card>
  );
};

export default DeadlineCard;
