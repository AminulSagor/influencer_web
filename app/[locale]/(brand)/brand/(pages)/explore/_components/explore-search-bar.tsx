"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Props = {
  placeholder: string;
  showingText: string;
  value?: string;
  onChange: (value: string) => void;
};

export default function ExploreSearchBar({
  placeholder,
  showingText,
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative w-[360px] max-w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 rounded-lg pl-9 placeholder:text-sm"
        />
      </div>

      <div className="text-xs text-muted-foreground">{showingText}</div>
    </div>
  );
}
