"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { IoIosHourglass } from "react-icons/io";

import { Button } from "@/components/ui/button";
import { getDashboardSummary } from "@/service/agency/dashboard-summary";
import type { DashboardSummaryData } from "@/types/agency/dashboard-summary";

const formatCurrency = (amount: number) => {
    return `৳ ${amount.toLocaleString("en-BD")}`;
};

const defaultSummary: DashboardSummaryData = {
    lifetimeEarnings: 0,
    pendingEarnings: 0,
    activeJobs: 0,
    newOffers: 0,
};

export default function DashboardSummaryCards() {
    const [summary, setSummary] = useState<DashboardSummaryData>(defaultSummary);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await getDashboardSummary();

                if (response.success) {
                    setSummary(response.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard summary:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const dashboardCards = [
        {
            title: "Lifetime Earning",
            value: formatCurrency(summary.lifetimeEarnings),
            icon: GoGoal,
        },
        {
            title: "Pending Earning",
            value: formatCurrency(summary.pendingEarnings),
            icon: IoIosHourglass,
        },
        {
            title: "Active Jobs",
            value: String(summary.activeJobs),
            icon: BiSolidBriefcaseAlt,
            link: "/agency/jobs/active-jobs",
        },
        {
            title: "New Offers",
            value: String(summary.newOffers),
            icon: FaHandHoldingHeart,
            link: "/agency/jobs",
        },
    ];

    return (
        <div className="px-4 pt-4">
            <div
                className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          2xl:grid-cols-4
        "
            >
                {dashboardCards.map(({ icon: Icon, link, title, value }, index) => (
                    <div
                        key={index}
                        className="
              rounded-lg
              bg-linear-to-r
              from-[#405E2C]/90
              to-[#7A9B57]
              p-5
              shadow-md
              space-y-8
            "
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-white">{title}</p>
                            <Icon size={35} className="text-white" />
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-white">
                                {isLoading ? "..." : value}
                            </p>

                            {link && (
                                <Button variant="link" className="p-0 text-white" asChild>
                                    <Link href={link} className="flex items-center">
                                        View All <ChevronRight />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}