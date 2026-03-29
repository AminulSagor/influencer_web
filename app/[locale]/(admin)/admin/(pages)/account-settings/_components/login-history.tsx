"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Apple, Monitor, Smartphone } from "lucide-react";
import type { ActivityLogItem } from "@/service/admin/settings/get-activity-log";

type Props = {
  history: ActivityLogItem[];
};

const getDeviceIcon = (device: string) => {
  const value = device.toLowerCase();

  if (
    value.includes("iphone") ||
    value.includes("ipad") ||
    value.includes("ios") ||
    value.includes("mac")
  ) {
    return Apple;
  }

  if (
    value.includes("android") ||
    value.includes("samsung") ||
    value.includes("mobile") ||
    value.includes("phone")
  ) {
    return Smartphone;
  }

  return Monitor;
};

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);

  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

const statusBadge = (status: string) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-light-green-100 text-light-green-700 hover:bg-light-green-100">
          Login Success
        </Badge>
      );

    case "failed":
      return (
        <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
          Failed Attempt
        </Badge>
      );

    case "password":
      return (
        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
          Password Changed
        </Badge>
      );

    default:
      return (
        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
          {status}
        </Badge>
      );
  }
};

export default function LoginHistoryCard({ history }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
        <CardDescription>Recent access to your account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity found.</p>
        ) : (
          history.map((item, i) => {
            const Icon = getDeviceIcon(item.device);
            const { date, time } = formatDateTime(item.timestamp);

            return (
              <div
                key={item.id}
                className={
                  item.status === "failed" ? "rounded-lg bg-red-50 p-3" : "p-3"
                }
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        item.status === "failed" ? "bg-red-100" : "bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {item.device} – {item.browser}
                      </p>

                      <p
                        className={`text-xs ${
                          item.status === "failed"
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.location} · {item.ip}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {date} · {time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {statusBadge(item.status)}
                  </div>
                </div>

                {i !== history.length - 1 && <Separator className="my-4" />}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}