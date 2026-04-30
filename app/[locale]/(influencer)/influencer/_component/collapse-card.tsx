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
  className?: string;
};

const CollapseCard = ({
  title,
  children,
  icon,
  titleColor = "text-Primary",
  className = "",
}: Props) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Card className={`flex flex-col border-none ${className}`}>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="flex h-full flex-col"
      >
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
        <CardContent className="flex flex-1 flex-col">
          <CollapsibleContent className="mt-4 flex flex-1 flex-col">
            {children}
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

export default CollapseCard;
