import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { CampaignStatusType } from "./campaign-milestone-data";

type BadgeType = "Completed" | "In Review";

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
            <AccordionTrigger className="p-0 mb-4 hover:no-underline hover:cursor-pointer">
              <div className="flex items-center gap-4 text-md text-Primary font-semibold">
                {icon && <span className="text-Primary">{icon}</span>}
                {heading}
                {badge && <Badge className={badgeClass}>{badge}</Badge>}
                {badgeText && (
                  <div className="border border-light-green px-4 py-2 rounded-md bg-linear-to-r from-white to-Secondary text-light-green font-medium ml-6">
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
