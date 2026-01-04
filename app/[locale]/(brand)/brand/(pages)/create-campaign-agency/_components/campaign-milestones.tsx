import { useFormStore } from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const CampaignMilestones = () => {
  const stepFour = useFormStore((s) => s.stepFour);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Image
            src={"/icons/milestone.svg"}
            height={18}
            width={18}
            alt="icon"
          />
          <h2 className="text-Primary font-semibold">Campaign Milestone</h2>
        </div>
      </CardHeader>

      <CardContent>
        {stepFour.milestones.length > 0 ? (
          <Carousel>
            <CarouselContent>
              {stepFour.milestones.map((milestone) => (
                <CarouselItem
                  key={milestone.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="bg-white border-light-green border p-3 min-h rounded-lg">
                    <div className="flex items-center gap-2">
                      <p className="h-5 w-5 flex items-center justify-center rounded-full bg-light-green text-white text-xs">
                        {milestone.id}
                      </p>
                      <p className="text-sm text-Primary">{milestone.title}</p>
                    </div>
                    <p className="text-xs text-dark-gray mt-1">
                      {milestone.subtitle}
                    </p>
                    <p className="text-end text-sm text-light-green mt-10">
                      {milestone.day}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 border-none" />
            <CarouselNext className="right-1 border-none" />
          </Carousel>
        ) : (
          <h1 className="text-light-green font-semibold text-xl text-center">
            Please add some milestone
          </h1>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignMilestones;
