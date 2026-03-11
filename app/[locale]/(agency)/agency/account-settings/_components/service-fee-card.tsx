import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

type ServiceFeeCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
};

const ServiceFeeCard = ({ profile, isLoading }: ServiceFeeCardProps) => {
  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-Primary hover:cursor-pointer hover:no-underline">
              Service Fee & Dollar Rate
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-1 px-1">
                  <p className="text-light-green">
                    Enter you Rate for each campaign spend
                  </p>

                  <Input
                    placeholder="eg: 10%"
                    className="text-center"
                    value={isLoading ? "Loading..." : profile?.serviceFee ?? ""}
                    readOnly
                  />
                </div>

                <div className="space-y-1 px-1">
                  <p className="text-light-green">Enter Default Dollar Rate</p>

                  <Input
                    placeholder="eg: 122 BDT"
                    className="text-center"
                    value={isLoading ? "Loading..." : profile?.dollarRate ?? ""}
                    readOnly
                  />
                </div>

                <div>
                  <Button className="w-full bg-light-green" type="button">
                    Save
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default ServiceFeeCard;