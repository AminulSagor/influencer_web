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
import { cn } from "@/lib/utils";
import { todo } from "node:test";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface PaymentMilestoneProps {
  paid?: number;
  total?: number;

  paidStatus?: boolean;
  inProgressStatus?: boolean;
  todoStatus?: boolean;
}

const PaymentMilestone: React.FC<PaymentMilestoneProps> = ({
  paid = 0,
  total = 4,

  inProgressStatus,
  paidStatus,
  todoStatus,
}) => {
  const progress = total ? Math.min((paid / total) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader className="flex  gap-4">
        {/* Title */}
        <CardTitle className="flex flex-1 items-center gap-2 text-Primary text-base font-semibold">
          <div>
            <Image
              src={"/icons/milestone.svg"}
              height={24}
              width={24}
              alt="svg"
            />
          </div>
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
              <CarouselItem
                key={item}
                className="basis-full md:basis-[34%] pl-4"
              >
                <div
                  className={cn(
                    "border p-4 border-light-green rounded-md space-y-2",

                    todoStatus &&
                      "border-gray-200 bg-linear-to-r from-white to-light-gray"
                  )}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full bg-light-green flex items-center justify-center text-white",
                          todoStatus && "bg-dark-gray"
                        )}
                      >
                        {item}
                      </div>
                      <h2
                        className={cn(
                          "text-base font-medium text-Primary",
                          todoStatus && "text-dark-gray"
                        )}
                      >
                        Initial Brand Awareness
                      </h2>
                    </div>
                    {todoStatus && (
                      <div>
                        <Badge className="bg-dark-gray">
                          Todo <ChevronRight />
                        </Badge>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm">
                    2 Instagram Posts + 3 Stories
                  </p>

                  <div
                    className={cn(
                      "flex items-center justify-between text-light-green",
                      todoStatus && "text-gray-600"
                    )}
                  >
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
