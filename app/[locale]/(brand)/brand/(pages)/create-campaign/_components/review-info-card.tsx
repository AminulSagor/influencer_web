import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { FaMusic, FaYoutube } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";

const ReviewInfoCard = () => {
  return (
    <Card className="border-none">
      <CardHeader className="text-Primary font-semibold">
        Summer Fashion Campaign
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-linear-to-r from-light-green/30 to-white border-light-green text-light-green rounded-lg border p-4">
          <h3 className="text-xs text-Primary">Your Campaign Budget</h3>
          <h1 className="text-2xl font-semibold">৳11,000</h1>
        </div>

        <div className="flex gap-2 items-center">
          <Image
            src={"/avatar/avatar.png"}
            height={26}
            width={26}
            alt="profile-image"
            className="rounded-full"
          />
          <h2 className="text-orange">StyleCo.</h2>
        </div>

        <div className="flex gap-10 items-center">
          <p className="text-dark-gray text-sm">Platform</p>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-sm bg-light-green text-white">
              <FiInstagram size={22} />
            </span>
            <span className="p-1 rounded-sm bg-light-green text-white">
              <FaYoutube size={22} />
            </span>
            <span className="p-1 rounded-sm bg-light-green text-white">
              <FaMusic size={22} />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewInfoCard;
