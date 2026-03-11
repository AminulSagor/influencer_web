"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BiSolidEdit } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

type NicheCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
};

const NicheCard = ({ profile, isLoading }: NicheCardProps) => {
  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-Primary hover:no-underline">
              <p className="flex items-center gap-2">
                Niche <BiSolidEdit size={20} />
              </p>
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    <Badge className="bg-Secondary px-4 py-1 text-Primary">
                      Loading...
                    </Badge>
                  ) : profile?.niches?.length ? (
                    profile.niches.map((item, index) => (
                      <Badge
                        key={`${item.niche}-${index}`}
                        className="flex items-center gap-2 bg-Secondary px-4 py-1 text-Primary"
                      >
                        <FaCheckCircle />
                        {item.niche}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No niches found.</p>
                  )}
                </div>

                <Button
                  className="w-full border border-dashed border-light-green bg-transparent text-light-green hover:bg-light-green hover:text-white"
                  size="sm"
                  type="button"
                >
                  + Add another Niche
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default NicheCard;