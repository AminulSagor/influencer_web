"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { RiUser3Fill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { getWorkInProgress } from "@/service/agency/work-in-progress";
import type {
  WorkInProgressItem,
  WorkInProgressResponse,
} from "@/types/agency/work-in-progress";

const DASHBOARD_VISIBLE_COUNT = 3;

const formatCurrency = (amount: string) => {
  const value = Number(amount);

  if (Number.isNaN(value)) return `৳ ${amount}`;

  return `৳ ${value.toLocaleString("en-BD")}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

const calculateDueDays = (startedAt: string, duration: number) => {
  const startDate = new Date(startedAt);

  if (Number.isNaN(startDate.getTime())) return 0;

  const deadline = new Date(startDate);
  deadline.setDate(deadline.getDate() + duration);

  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const startOfDeadline = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate()
  );

  const diffInMs = startOfDeadline.getTime() - startOfToday.getTime();

  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

const getDueLabel = (startedAt: string, duration: number) => {
  const dueDays = calculateDueDays(startedAt, duration);

  if (dueDays < 0) {
    return `Due: ${dueDays} Days`;
  }

  if (dueDays === 0) {
    return "Due: Today";
  }

  if (dueDays === 1) {
    return "Due: Tomorrow";
  }

  return `Due: ${dueDays} Days`;
};

const defaultResponse: WorkInProgressResponse = {
  success: true,
  data: [],
  meta: {
    total: 0,
    page: 1,
    limit: 5,
  },
};

const WorkInProgressCard = () => {
  const [response, setResponse] = useState<WorkInProgressResponse>(defaultResponse);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  useEffect(() => {
    const fetchWorkInProgress = async () => {
      try {
        const result = await getWorkInProgress();
        setResponse(result);
      } catch (error) {
        console.error("Failed to load work in progress:", error);
        setResponse(defaultResponse);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkInProgress();
  }, []);

  const visibleItems = response.data.slice(0, DASHBOARD_VISIBLE_COUNT);

  return (
    <Card>
      <CardHeader className="border-b flex items-center justify-between">
        <CardTitle className="text-[#2D5016]">Work in progress</CardTitle>

        <CardAction>
          <Button className="bg-[#7A9B57]/90 hover:bg-[#7a9b57]" size="sm">
            {response.meta.total} Active
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : visibleItems.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No active work in progress right now.
          </div>
        ) : (
          visibleItems.map((data: WorkInProgressItem) => (
            <div className="border p-4 rounded-lg shadow-sm" key={data.campaignId}>
              <div className="flex justify-between items-center space-y-1">
                <div className="space-y-1">
                  <h3 className="font-semibold text-[#2d5016]">
                    {data.campaignName}
                  </h3>
                  <p className="text-[#7A9B57] text-lg">{data.serviceFee}%</p>
                </div>

                <div>
                  <div className="bg-yellow-600/30 border-yellow-700 border px-4 py-1 rounded-lg flex justify-center items-center">
                    <span className="text-yellow-700 text-sm font-medium">
                      {getDueLabel(data.startedAt, data.duration)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-1">
                <span>
                  <RiUser3Fill size={12} className="fill-yellow-600" />
                </span>
                <span className="text-xs text-yellow-600">{data.brandName}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span>
                    <FaClock size={12} className="fill-yellow-600" />
                  </span>
                  <span className="text-xs text-yellow-600">
                    {formatDate(data.startedAt)}
                  </span>
                </div>

                <p className="text-[#7A9B57] font-semibold">
                  Budget: {formatCurrency(data.totalBudget)}
                </p>
              </div>

              <div className="pt-2">
                <Slider value={[data.progress]} max={100} step={1} />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-yellow-600 text-sm">{data.progress}% Complete</p>

                <Button variant="link" size="sm">
                  <Link
                    href={`/${locale}/agency/campaign-details/${data.campaignId}`}
                    className="flex items-center text-xs"
                  >
                    View <ChevronRight />
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <CardFooter className="justify-center">
        <Button
          asChild
          className="w-full md:w-[50%] bg-[#F5F5DC]/60 text-[#2D5016] border-[#2D5016] border hover:bg-[#F5F5DC] hover:text-[#2D5016] hover:border-[#2D5016] cursor-pointer"
        >
          <Link href={`/${locale}/agency/jobs/active-jobs`} className="flex items-center gap-2">
            View All Jobs
            <FaArrowRightLong />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkInProgressCard;