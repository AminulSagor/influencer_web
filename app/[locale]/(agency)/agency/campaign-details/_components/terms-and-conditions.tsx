import React from "react";
import { TbMessageReportFilled } from "react-icons/tb";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaFileAlt } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { FaCopyright, FaRegCircleCheck } from "react-icons/fa6";
const TermsAndConditions = () => {
  return (
    <div className="flex-2">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-md p-0 hover:cursor-pointer hover:no-underline mb-4">
            <div className="text-Primary flex items-center gap-2 flex-2">
              <span>
                <FaFileAlt />
              </span>
              <h3 className="font-semibold text-base">Terms & Conditions</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div className="space-y-4">
              <h3 className="text-Primary flex items-center gap-2 font-semibold text-sm">
                <TbMessageReportFilled size={20} /> Reporting Requirements
              </h3>
              <p className="text-gray-500">
                Provide analytics screenshots 7 days post-publication. Include
                reach, engagement, and click-through rates.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-Primary flex items-center gap-2 font-semibold text-sm">
                <FaCopyright size={20} /> Usage Rights
              </h3>
              <p className="text-gray-500">
                Provide analytics screenshots 7 days post-publication. Include
                reach, engagement, and click-through rates.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TermsAndConditions;
