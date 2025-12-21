import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GiMountains } from "react-icons/gi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PaymentMilestoneProps {
  paid?: number;
  total?: number;
}

const PaymentMilestone: React.FC<PaymentMilestoneProps> = ({
  paid = 0,
  total = 4,
}) => {
  const progress = total ? Math.min((paid / total) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader className="flex  gap-4">
        {/* Title */}
        <CardTitle className="flex flex-1 items-center gap-2 text-Primary text-base font-semibold">
          <GiMountains size={24} />
          Payment Milestone
        </CardTitle>

        {/* Progress section */}
        <div className=" flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">Progress</p>
            <p className="text-sm font-semibold text-Primary">
              {paid} of {total} Paid
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-light-green rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Carousel className="overflow-visible">
          <CarouselContent className="-ml-4 pr-24">
            {[1, 2, 3, 4].map((item) => (
              <CarouselItem key={item} className="basis-[34%] pl-4">
                <div className="border p-4 border-light-green rounded-md space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-light-green flex items-center justify-center text-white">
                      {item}
                    </div>
                    <h2 className="text-base font-medium text-Primary">
                      Initial Brand Awareness
                    </h2>
                  </div>

                  <p className="text-gray-500 text-sm">
                    2 Instagram Posts + 3 Stories
                  </p>

                  <div className="flex items-center justify-between text-light-green">
                    <p className="text-xl font-semibold">৳ 3,000</p>
                    <p className="text-sm">DAY {item}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext variant={"ghost"} />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default PaymentMilestone;
