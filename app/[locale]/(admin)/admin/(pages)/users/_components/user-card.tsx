"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { useState } from "react";

function capitalizeFirstLetter(text?: string): string {
  if (!text) return "";
  return text[0].toUpperCase() + text.slice(1);
}

const UserCard = () => {
  const pathname = usePathname();
  const url = pathname.split("/").pop();
  const cardTitle = capitalizeFirstLetter(url);

  const [activeTab, setActiveTab] = useState<"all" | "blocked">("all");

  const getButtonClass = (tab: "all" | "blocked") =>
    activeTab === tab
      ? "bg-light-green text-white px-3 py-1 rounded-full px-6"
      : "text-Primary";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-Primary">{cardTitle}</CardTitle>
            <CardDescription>Browse {url} and their details</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="link"
              className={getButtonClass("all")}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>

            <Button
              variant="link"
              className={getButtonClass("blocked")}
              onClick={() => setActiveTab("blocked")}
            >
              Blocked
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
