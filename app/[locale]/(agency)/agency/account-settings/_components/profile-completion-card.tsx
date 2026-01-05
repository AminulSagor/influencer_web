import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiSolidEdit } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

const ProfileCompletionCard = () => {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-Primary">
          <FaCheckCircle /> Profile Completion
        </CardTitle>
        <div>
          <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-light-green rounded-full transition-all duration-300"
              style={{ width: `${50}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-2 space-y-2">
          <h2 className="text-base font-semibold text-Primary flex items-center gap-2">
            Bio <BiSolidEdit size={20} />
          </h2>
          <p className="text-sm font-light text-gray-400">
            The authority in Fashion & Lifestyle marketing. With deep industry
            connections and a passion for aesthetics, we place your brand at the
            center.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
