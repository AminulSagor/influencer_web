import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

const ServiceFeeCard = () => {
  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-md p-0 hover:cursor-pointer hover:no-underline mb-4 text-Primary font-semibold">
              Service Fee & Dollar Rate
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="px-1 space-y-1">
                  <p className="text-light-green">
                    Enter you Rate for each campaign spend
                  </p>

                  <Input placeholder="eg: 10%" className="text-center" />
                </div>{" "}
                <div className="px-1 space-y-1">
                  <p className="text-light-green">Enter Default Dollar Rate</p>

                  <Input placeholder="eg: 122 BDT" className="text-center" />
                </div>
                <div>
                  <Button className="bg-light-green w-full">Save</Button>
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
