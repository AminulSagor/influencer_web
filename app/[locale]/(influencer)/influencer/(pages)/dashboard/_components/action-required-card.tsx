"use client";

import { IoMdCloseCircle } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { getActionRequired } from "@/service/influencer/dashboard/action_required";
import { ActionRequiredItem } from "@/types/influencer/dashboard/action_required";
import Link from "next/link";

const priorityConfig = {
  HIGH: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: <IoMdCloseCircle className="fill-rose-600" size={30} />,
    textColor: "text-rose-600",
    btnClass: "bg-rose-600 hover:bg-rose-700 cursor-pointer",
  },
  MEDIUM: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    icon: <FaExclamationTriangle className="fill-yellow-600" size={30} />,
    textColor: "text-yellow-600",
    btnClass: "bg-yellow-600 hover:bg-yellow-700 cursor-pointer",
  },
  LOW: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <FaExclamationTriangle className="fill-blue-600" size={30} />,
    textColor: "text-blue-600",
    btnClass: "bg-blue-600 hover:bg-blue-700 cursor-pointer",
  },
};

const getActionHref = (locale: string, action: ActionRequiredItem) => {
  if (action.type === "SUBMISSION") {
    return `/${locale}/influencer/jobs`;
  }

  return `/${locale}/influencer/account-settings`;
};

const ActionRequiredCard = () => {
  const t = useTranslations("influencer.dashboard.actionRequired");
  const locale = useLocale();
  const [actions, setActions] = useState<ActionRequiredItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getActionRequired();
      setActions(res.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-2 p-4 rounded-md border">
                <div className="flex items-center gap-2 flex-1">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 space-y-2">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchActions}>
              Retry
            </Button>
          </div>
        ) : actions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No actions required</p>
        ) : (
          actions.map((action, index) => {
            const config = priorityConfig[action.priority] || priorityConfig.MEDIUM;
            return (
              <div
                key={`${action.type}-${action.date}-${index}`}
                className={`${config.bg} px-2 py-4 rounded-md border ${config.border} shadow-sm`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {config.icon}
                    <div>
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      {action.description && (
                        <p className={`${config.textColor} text-xs font-medium`}>
                          {action.description}
                        </p>
                      )}
                      <span className="text-muted-foreground text-xs">
                        {new Date(action.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className={config.btnClass} asChild>
                    <Link href={getActionHref(locale, action)}>{t("card1Button")}</Link>
                  </Button>
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
