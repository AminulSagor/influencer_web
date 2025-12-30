import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  icon?: React.ReactNode;
  text?: string;
  className?: string;
  children?: React.ReactNode;
};

const IconText = ({ icon, text, className }: Props) => {
  return (
    <p className={cn("flex items-center gap-1", className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      {text && <span>{text}</span>}
    </p>
  );
};

export default IconText;
