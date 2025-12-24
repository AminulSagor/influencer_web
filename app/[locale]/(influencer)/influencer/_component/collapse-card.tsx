"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  titleColor?: string;
};

const CollapseCard = ({
  title,
  children,
  icon,
  titleColor = "text-Primary",
}: Props) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader className="flex flex-row items-center justify-between">
          {title && (
            <p className="font-semibold flex items-center gap-2">
              <span className={titleColor}>{title}</span>
              {icon && <span>{icon}</span>}
            </p>
          )}
          <CollapsibleTrigger asChild>
            <ChevronUp
              className={`${
                !open && "rotate-180"
              } text-Primary cursor-pointer ease-in-out duration-300`}
              size={28}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CardContent>
          <CollapsibleContent className="mt-4">{children}</CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

export default CollapseCard;
