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

const history = [
  {
    date: "Dec 12, 2025",
    time: "10:42 PM",
    device: "iPhone 13 Pro",
    browser: "Safari",
    location: "Dhaka, BD",
    ip: "192.168.xx",
    status: "success",
    duration: "1h 25m",
    icon: Apple,
  },
  {
    date: "Dec 11, 2025",
    time: "2:15 PM",
    device: "iPhone 16 Pro",
    browser: "Safari",
    location: "Chittagong, BD",
    ip: "192.168.xx",
    status: "failed",
    icon: Apple,
  },
  {
    date: "Dec 12, 2025",
    time: "10:42 PM",
    device: "Samsung Galaxy",
    browser: "Chrome Mobile",
    location: "Khulna, BD",
    ip: "192.168.xx",
    status: "success",
    duration: "49m",
    icon: Smartphone,
  },
  {
    date: "Dec 9, 2025",
    time: "2:15 PM",
    device: "Windows 11 PC",
    browser: "Chrome",
    location: "Chittagong, BD",
    ip: "192.168.xx",
    status: "failed",
    icon: Monitor,
  },
  {
    date: "Dec 9, 2025",
    time: "2:15 PM",
    device: "Macbook Pro",
    browser: "Chrome",
    location: "Khulna, BD",
    ip: "192.168.xx",
    status: "password",
    duration: "15m",
    icon: Monitor,
  },
];

const statusBadge = (status: string) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-light-green-100 text-light-green-700">Login Success</Badge>
      );
    case "failed":
      return <Badge className="bg-red-100 text-red-600">Failed Attempt</Badge>;
    case "password":
      return (
        <Badge className="bg-blue-100 text-blue-600">Password Changed</Badge>
      );
  }
};

export default function LoginHistoryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
        <CardDescription>Recent access to your account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {history.map((item, i) => (
          <div
            key={i}
            className={
              item.status === "failed" ? "rounded-lg bg-red-50 p-3" : "p-3"
            }
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-4">
                <div
                  className={`h-10 w-10 flex items-center justify-center rounded-lg ${
                    item.status === "failed" ? "bg-red-100" : "bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
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
                    {item.date} · {item.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.duration && (
                  <span className="text-xs text-muted-foreground">
                    {item.duration}
                  </span>
                )}
                {statusBadge(item.status)}
              </div>
            </div>
            {i !== history.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
