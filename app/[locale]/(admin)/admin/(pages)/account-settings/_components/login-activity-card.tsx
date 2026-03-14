"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";
import { FaApple, FaMobileAlt, FaWindows } from "react-icons/fa";
import { Monitor } from "lucide-react";
import LoginHistoryCard from "./login-history";
import type { ActivityLogItem } from "@/service/admin/settings/get-activity-log";

type Props = {
  history: ActivityLogItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

const getCurrentDeviceIcon = (device: string) => {
  const value = device.toLowerCase();

  if (
    value.includes("iphone") ||
    value.includes("ipad") ||
    value.includes("ios") ||
    value.includes("mac")
  ) {
    return <FaApple />;
  }

  if (
    value.includes("android") ||
    value.includes("samsung") ||
    value.includes("mobile") ||
    value.includes("phone")
  ) {
    return <FaMobileAlt />;
  }

  if (value.includes("windows")) {
    return <FaWindows />;
  }

  return <Monitor className="h-4 w-4" />;
};

const LoginActivityCard = ({ history }: Props) => {
  const currentSession = history?.[0];

  return (
    <Card>
      <div className="px-4">
        <div className="rounded-md border border-light-green bg-light-green-50 p-4">
          {currentSession ? (
            <div className="flex justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button className="border-light-green" variant="outline">
                  {getCurrentDeviceIcon(currentSession.device)}
                </Button>

                <div>
                  <p className="mb-1 text-xl font-medium">
                    You are currently logged in on this device
                  </p>

                  <div>
                    <p>
                      {currentSession.device} - {currentSession.browser}
                    </p>
                    <p className="text-sm text-light-green">
                      {currentSession.location}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {currentSession.ip}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="aspect-square w-4 rounded-full bg-light-green" />
                <p className="text-sm text-light-green">Online Now</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No current session found.
            </p>
          )}
        </div>
      </div>

      <div className="px-4">
        <LoginHistoryCard history={history} />
      </div>
    </Card>
  );
};

export default LoginActivityCard;