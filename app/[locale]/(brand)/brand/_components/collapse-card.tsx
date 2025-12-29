"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type Props = {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  titleColor?: string;
};

const CollapseCard = ({ title, children, icon, titleColor }: Props) => {
  return (
    <Card className="border-none">
      <CardContent className="py-0">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger
              className={`text-Primary cursor-pointer font-semibold text-base py-0 ${titleColor}`}
            >
              <h1 className="flex items-center gap-2">
                {icon && icon}
                {title}
              </h1>
            </AccordionTrigger>
            <AccordionContent className="pt-4">{children}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default CollapseCard;
