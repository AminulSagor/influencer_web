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
            link: "/",
        },
        {
            title: "New Offers",
            value: String(summary.newOffers),
            icon: FaHandHoldingHeart,
            link: "/",
        },
    ];

    return (
        <div className="pt-4 px-4">
            <div
                className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          2xl:grid-cols-4
          gap-4
        "
            >
                {dashboardCards.map(({ icon: Icon, link, title, value }, index) => (
                    <div
                        key={index}
                        className="
              bg-linear-to-r
              from-[#405E2C]/90
              to-[#7A9B57]
              rounded-lg
              p-5
              space-y-8
              shadow-md
            "
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-white">{title}</p>
                            <Icon size={35} className="text-white" />
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-white font-bold text-2xl">
                                {isLoading ? "..." : value}
                            </p>

                            {link && (
                                <Button variant="link" className="text-white p-0">
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