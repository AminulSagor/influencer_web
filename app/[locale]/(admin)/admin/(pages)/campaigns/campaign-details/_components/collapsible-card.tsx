import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

export type BadgeType = "Completed" | "In Review";

type CollapsibleCardProps = {
  children: ReactNode;
  heading: string;
  icon?: ReactNode;
  badgeText?: string;
  badge?: BadgeType;
};

const badgeVariants: Record<BadgeType, string> = {
  Completed: "bg-Primary text-white",
  "In Review": "bg-orange text-white",
};

const CollapsibleCard = ({
  children,
  heading,
  icon,
  badgeText,
  badge,
}: CollapsibleCardProps) => {
  const badgeClass = badge ? badgeVariants[badge] || "bg-gray-300" : "";

  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 font-semibold text-Primary hover:cursor-pointer hover:no-underline">
              <div className="flex items-center gap-4 text-md">
                {icon && <span className="text-Primary">{icon}</span>}
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