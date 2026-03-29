"use client";

import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getActionRequired } from "@/service/agency/action-required";
import type { ActionRequiredItem } from "@/types/agency/action-required";

const formatActionDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffInMs = today.getTime() - targetDay.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  const timeText = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  if (diffInDays === 0) {
    return `Today, ${timeText}`;
  }

  if (diffInDays === 1) {
    return `Yesterday, ${timeText}`;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getActionUI = (type: string) => {
  if (type === "SUBMISSION") {
    return {
      wrapperClass:
        "bg-yellow-50 px-2 py-4 rounded-md border border-yellow-300 shadow-sm",
      icon: <FaExclamationTriangle className="fill-yellow-600" size={30} />,
      descriptionClass: "text-yellow-700 text-xs font-medium",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700 cursor-pointer",
      buttonText: "Fix",
    };
  }

  return {
    wrapperClass:
      "bg-rose-50 px-2 py-4 rounded-md border border-rose-200 shadow-sm",
    icon: <IoMdCloseCircle className="fill-rose-600" size={30} />,
    descriptionClass: "text-rose-600 text-xs font-medium",
    buttonClass: "bg-rose-600 hover:bg-rose-700 cursor-pointer",
    buttonText: "Review",
  };
};

const ActionRequiredCard = () => {
  const [actions, setActions] = useState<ActionRequiredItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await getActionRequired();

        if (response.success) {
          setActions(response.data);
        }
      } catch (error) {
        console.error("Failed to load action required items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">Action Required</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : actions.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No action required right now.
          </div>
        ) : (
          actions.map((item, index) => {
            const ui = getActionUI(item.type);

            return (
              <div key={`${item.type}-${item.date}-${index}`} className={ui.wrapperClass}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div>{ui.icon}</div>

                    <div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>

                      <p className={ui.descriptionClass}>{item.description}</p>

                      <span className="text-muted-foreground text-xs">
                        {formatActionDate(item.date)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Button size="sm" className={ui.buttonClass}>
                      {ui.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ActionRequiredCard;