"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getNewJobOffers } from "@/service/agency/new-job-offers";
import type { NewJobOfferItem } from "@/types/agency/new-job-offers";

const DASHBOARD_VISIBLE_COUNT = 3;

const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString("en-BD")}`;
};

const NewJobOffers = () => {
  const [offers, setOffers] = useState<NewJobOfferItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await getNewJobOffers();

        if (response.success) {
          setOffers(response.data);
        }
      } catch (error) {
        console.error("Failed to load new job offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const visibleOffers = offers.slice(0, DASHBOARD_VISIBLE_COUNT);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-[#2d5016]">New Job Offers</CardTitle>

        <div>
          <Button variant="link" size="sm" className="p-0 text-[#2d5016]">
            <Link href={`/${locale}/agency/jobs`} className="flex items-center text-xs">
              View All
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : visibleOffers.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No new job offers right now.
          </div>
        ) : (
          visibleOffers.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg bg-secondary px-4 py-2"
            >
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-sm font-semibold text-[#2d5016]">
                  {item.campaignName}
                </h3>

                <Button variant="link" size="sm" className="p-0 text-[#2d5016]">
                  <Link
                    href={`/${locale}/agency/campaign-details/${item.id}`}
                    className="flex items-center text-xs"
                  >
                    View <ChevronRight />
                  </Link>
                </Button>
              </div>

              <p className="text-lg font-semibold text-[#2d5016]">
                {item.financials.adminOfferedServiceFeePercent}%
              </p>

              <p className="text-sm font-medium text-[#2d5016]">
                Budget: {formatCurrency(item.financials.totalBudget)}
              </p>

              <div className="flex gap-2 py-2">
                <Button className="flex-1 bg-[#7a9b57] hover:bg-[#5a7a3d] cursor-pointer">
                  Accept
                </Button>

                <Button className="flex-1 cursor-pointer" variant="outline">
                  Decline
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default NewJobOffers;