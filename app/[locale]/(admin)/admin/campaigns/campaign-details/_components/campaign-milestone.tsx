import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { campaignMilestoneData } from "./campaign-milestone-data";

const CampaignMilestone = () => {
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
            <p className="text-sm font-semibold text-Primary">1 of 4 Paid</p>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-light-green rounded-full transition-all duration-300"
              style={{ width: `${70}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Carousel className="overflow-visible">
          <CarouselContent className="p-2 -ml-4 pr-24 ">
            {campaignMilestoneData.map((item) => (
              <CarouselItem key={item.id} className="basis-full md:basis-[34%]">
                <div
                  // onClick={() => onSelectMilestone(item)}
                  className={cn(
                    "border p-4 rounded-md space-y-2 cursor-pointer transition"
                    // selectedMilestone?.id === item.id &&
                    //   "ring-2 ring-offset-0 ring-light-green",
                    // item.status === TODO &&
                    //   "border-gray-200 bg-linear-to-r from-white to-light-gray",
                    // item.status === PAID &&
                    //   "border-light-green bg-linear-to-r from-Secondary to-white",
                    // item.status === IN_REVIEW &&
                    //   "border-orange-400 bg-linear-to-r from-orange/20 to-white"
                  )}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full bg-light-green flex items-center justify-center text-white"
                          // item.status === TODO && "bg-dark-gray",
                          // item.status === IN_REVIEW && "bg-orange"
                        )}
                      >
                        {item.id}
                      </div>
                      <h2
                        className={cn(
                          "text-base font-medium text-Primary"
                          // item.status === TODO && "text-dark-gray",
                          // item.status === IN_REVIEW && "text-orange"
                        )}
                      >
                        {item.title}
                      </h2>
                    </div>
                    {/* {item.status && (
                      <div>
                        <Badge
                          className={
                            cn()
                            item.status === TODO && "bg-dark-gray",
                            item.status === IN_REVIEW && "bg-orange",
                            item.status === PAID && "bg-light-green"
                          }
                        >
                          {item.status} <ChevronRight />
                        </Badge>
                      </div>
                    )} */}
                  </div>

                  <p className="text-gray-500 text-sm">
                    {item.contentRequirement.map((i, index) => (
                      <span key={i}>
                        {i}
                        {index !== item.contentRequirement.length - 1 && " + "}
                      </span>
                    ))}
                  </p>

                  <div
                    className={cn(
                      "flex items-center justify-between text-light-green"
                      // item.status === TODO && "text-gray-600",
                      // item.status === IN_REVIEW && "text-orange"
                    )}
                  >
                    <p></p>
                    {/* <p className="text-xl font-semibold">৳ {item.payout}</p> */}
                    <p className="text-sm">DAY {item.day}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant={"ghost"} />
          <CarouselNext variant={"ghost"} />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default CampaignMilestone;
