"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLifetimeSummary } from "@/service/agency/lifetime-summary";
import type { LifetimeSummaryData } from "@/types/agency/lifetime-summary";

const defaultLifetimeSummary: LifetimeSummaryData = {
    totalEarnings: 0,
    totalJobsCompleted: 0,
    totalJobsDeclined: 0,
    topClient: null,
    mostUsedPlatform: "",
};

const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "N/A";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

const formatPlatform = (platform?: string) => {
    if (!platform) return "N/A";
    return platform.charAt(0).toUpperCase() + platform.slice(1);
};

export default function LifetimeSummaryCard() {
    const [summary, setSummary] = useState<LifetimeSummaryData>(
        defaultLifetimeSummary
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLifetimeSummary = async () => {
            try {
                const response = await getLifetimeSummary();

                if (response.success) {
                    setSummary(response.data);
                }
            } catch (error) {
                console.error("Failed to load lifetime summary:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLifetimeSummary();
    }, []);

    const topClientName = isLoading
        ? "..."
        : summary.topClient?.name || "N/A";

    const topClientJobsCompleted = isLoading
        ? "..."
        : `${summary.topClient?.jobsCompleted ?? 0} Jobs Completed`;

    const lastCompletedJobDate = isLoading
        ? "..."
        : `Last Job: ${formatDate(summary.topClient?.lastCompletedJob?.completedAt)}`;

    const totalJobsCompleted = isLoading
        ? "..."
        : String(summary.totalJobsCompleted);

    const totalJobsDeclined = isLoading
        ? "..."
        : String(summary.totalJobsDeclined);

    const mostUsedPlatform = isLoading
        ? "..."
        : formatPlatform(summary.mostUsedPlatform);

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-[#2d5016]">Lifetime Summary</CardTitle>
                </CardHeader>

                <CardContent className="grid lg:grid-cols-4 gap-2">
                    <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                        <p className="text-sm font-medium">Top Client</p>

                        <div>
                            <h2 className="text-3xl font-semibold text-[#7a9b57]">
                                {topClientName}
                            </h2>

                            <p className="text-sm font-medium text-[#7a9b57]">
                                {topClientJobsCompleted}
                            </p>
                        </div>

                        <p className="text-xs font-medium text-muted-foreground">
                            {lastCompletedJobDate}
                        </p>
                    </div>

                    <Link
                        href="/agency/jobs/completed"
                        className="border bg-secondary px-4 py-2 rounded-lg space-y-2 transition hover:bg-secondary/80"
                    >
                        <div className="flex flex-col justify-center gap-1 h-full">
                            <h2 className="text-3xl font-semibold text-[#7a9b57]">
                                {totalJobsCompleted}
                            </h2>

                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Total Jobs Completed</p>
                                <div>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/agency/jobs/declined"
                        className="border bg-secondary px-4 py-2 rounded-lg space-y-2 transition hover:bg-secondary/80"
                    >
                        <div className="flex flex-col justify-center gap-1 h-full">
                            <h2 className="text-3xl font-semibold text-yellow-700">
                                {totalJobsDeclined}
                            </h2>

                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Total Jobs Declined</p>
                                <div>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    </Link>

                    <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                        <div className="flex flex-col justify-center gap-1 h-full">
                            <h2 className="text-3xl font-semibold text-[#7a9b57]">
                                {mostUsedPlatform}
                            </h2>

                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Most Used Platform</p>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}