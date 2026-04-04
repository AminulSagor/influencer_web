"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUpcomingDeadlines } from "@/service/agency/upcoming-deadlines";
import type { UpcomingDeadlineItem } from "@/types/agency/upcoming-deadlines";

const DASHBOARD_VISIBLE_COUNT = 3;

const formatDeadlineParts = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return {
      month: "N/A",
      dayOrYear: "",
    };
  }

  const now = new Date();
  const isDifferentYear = date.getFullYear() !== now.getFullYear();

  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);

  const day = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
  }).format(date);

  if (isDifferentYear) {
    return {
      month,
      dayOrYear: String(date.getFullYear()),
    };
  }

  return {
    month,
    dayOrYear: day,
  };
};

const UpcomingDeadline = () => {
  const [deadlines, setDeadlines] = useState<UpcomingDeadlineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await getUpcomingDeadlines();

        if (response.success) {
          setDeadlines(response.data);
        }
      } catch (error) {
        console.error("Failed to load upcoming deadlines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  const visibleDeadlines = deadlines.slice(0, DASHBOARD_VISIBLE_COUNT);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">Upcoming Deadlines</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : visibleDeadlines.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No upcoming deadlines right now.
          </div>
        ) : (
          visibleDeadlines.map((item) => {
            const deadlineParts = formatDeadlineParts(item.deadline);

            return (
              <div key={item.campaignId} className="flex">
                <div className="w-4 bg-[#2d5016]" />

                <div className="bg-secondary w-full p-2 space-y-4 rounded-br-lg rounded-tr-lg">
                  <div className="flex justify-between items-center gap-4">
                    <p className="text-center font-semibold text-[#2d5016] text-sm min-w-[44px]">
                      {deadlineParts.month} <br />
                      {deadlineParts.dayOrYear}
                    </p>

                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2d5016] text-sm">
                        {item.campaignName}
                      </h3>

                      <p className="text-xs text-muted-foreground">
                        {item.milestonesLeftText}
                      </p>
                    </div>

                    <Button variant="link" size="sm" className="p-0">
                      <Link
                        href={`/${locale}/agency/campaign-details/${item.campaignId}`}
                        className="flex items-center text-xs"
                      >
                        View <ChevronRight />
                      </Link>
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

export default UpcomingDeadline;