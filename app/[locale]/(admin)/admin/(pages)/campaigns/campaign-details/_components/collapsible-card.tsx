import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

export type BadgeType =
  | "Completed"
  | "In Review"
  | "Paid"
  | "Partial Paid"
  | "Declined";

type CollapsibleCardProps = {
  children: ReactNode;
  heading: string;
  icon?: ReactNode;
  badgeText?: string;
  badge?: BadgeType;
};

const badgeVariants: Record<BadgeType, string> = {
  Completed: "bg-Primary text-white border-0",
  "In Review": "bg-orange text-white border-0",
  Paid: "bg-Primary text-white border-0",
  "Partial Paid": "bg-orange text-white border-0",
  Declined: "bg-red text-black border-0",
};

const cardVariants: Record<BadgeType, string> = {
  Completed: "border border-[#B7C997] bg-[#F8F8EF]",
  "In Review": "border border-[#F0C998] ",
  Paid: "border border-[#B7C997] bg-[#F8F8EF]",
  "Partial Paid": "border border-[#F0C998]",
  Declined: "border border-[#FF8F8F] bg-[#FFF1F1]",
};

const headingVariants: Record<BadgeType, string> = {
  Completed: "text-Primary",
  "In Review": "text-[#D6852D]",
  Paid: "text-Primary",
  "Partial Paid": "text-[#D6852D]",
  Declined: "text-[#FF1E1E]",
};

const CollapsibleCard = ({
  children,
  heading,
  icon,
  badgeText,
  badge,
}: CollapsibleCardProps) => {
  const badgeClass = badge ? badgeVariants[badge] || "bg-gray-300" : "";
  const cardClass = badge ? cardVariants[badge] || "" : "border border-[#DDDDDD]";
  const headingClass = badge ? headingVariants[badge] || "text-Primary" : "text-Primary";

  return (
    <Card className={cardClass}>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger
              className={`mb-4 p-0 font-semibold hover:cursor-pointer hover:no-underline ${headingClass}`}
            >
              <div className="flex items-center gap-4 text-md">
                {icon && <span className={headingClass}>{icon}</span>}
                {heading}
                {badge && <Badge className={badgeClass}>{badge}</Badge>}
                {badgeText && (
                  <div className="ml-6 rounded-md border border-light-green bg-linear-to-r from-white to-Secondary px-4 py-2 font-medium text-light-green">
                    {badgeText}
                  </div>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent>{children}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default CollapsibleCard;