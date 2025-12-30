import { campaignContents } from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/dummy-data/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

const CampaignMilestones = () => {
  return (
    <Card className="border-none">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-1">
          {/* left */}
          <div className="flex items-center gap-2">
            <Image
              src={"/icons/milestone.svg"}
              height={18}
              width={18}
              alt="icon"
            />
            <h2 className="text-Primary font-semibold">Campaign Milestone</h2>
          </div>

          {/* right */}
          <p className="border text-sm py-2 px-4 rounded-lg bg-light-gray">
            Campaign Not Started
          </p>
        </div>

        {/* progress bar */}
        <Progress value={0} className="md:w-1/2"/>
      </CardHeader>

      <CardContent>
        <Carousel>
          <CarouselContent>
            {campaignContents.map((content) => (
              <CarouselItem
                key={content.id}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="bg-white border-light-green border p-3 min-h rounded-lg">
                  <div className="flex items-center gap-2">
                    <p className="h-5 w-5 flex items-center justify-center rounded-full bg-light-green text-white text-xs">
                      {content.id}
                    </p>
                    <p className="text-sm text-Primary">{content.title}</p>
                  </div>
                  <p className="text-xs text-dark-gray mt-1">
                    {content.description}
                  </p>
                  <p className="text-end text-sm text-light-green mt-10">
                    {content.day}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 border-none" />
          <CarouselNext className="right-1 border-none" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default CampaignMilestones;
