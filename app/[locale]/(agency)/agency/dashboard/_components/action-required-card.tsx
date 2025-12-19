import { IoMdCloseCircle } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ActionRequiredCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">Action Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-rose-50 px-2 py-4 rounded-md  border border-rose-200 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                <IoMdCloseCircle className="fill-rose-600" size={30} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  Summer Fashion Campaign
                </h3>
                <p className="text-rose-600 text-xs font-medium">
                  Milestone 1 - Submission 01 Rejected
                </p>
                <span className="text-muted-foreground text-xs">
                  Yesterday, 4:30pm
                </span>
              </div>
            </div>
            <div>
              <Button
                size={"sm"}
                className="bg-rose-600 hover:bg-rose-700 cursor-pointer"
              >
                Review
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 px-2 py-4 rounded-md  border border-yellow-300 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                <FaExclamationTriangle className="fill-yellow-600" size={30} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  Trade License Rejected
                </h3>
                <span className="text-muted-foreground text-xs">
                  Yesterday, 4:30pm
                </span>
              </div>
            </div>
            <div>
              <Button
                size={"sm"}
                className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
              >
                Review
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionRequiredCard;
