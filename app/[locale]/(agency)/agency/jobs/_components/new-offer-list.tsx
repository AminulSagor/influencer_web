"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { JSX } from "react";
import { AiFillTikTok } from "react-icons/ai";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { RiInstagramFill, RiLinkedinFill, RiYoutubeFill } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { NewJobOfferItem } from "@/types/agency/new-job-offers";

type NewOfferListProps = {
  items: NewJobOfferItem[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const platformIcons: Record<string, JSX.Element> = {
  instagram: <RiInstagramFill size={18} className="fill-light-green" />,
  youtube: <RiYoutubeFill size={18} className="fill-light-green" />,
  tiktok: <AiFillTikTok size={18} className="fill-light-green" />,
  facebook: <FaFacebookF size={14} className="fill-light-green" />,
  linkedin: <RiLinkedinFill size={18} className="fill-light-green" />,
};

const formatCurrency = (value: number) => {
  return `৳${Math.round(value).toLocaleString("en-US")}`;
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

const getDurationText = (days: number) => {
  return `${days} Days`;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getProfitAmount = (
  totalBudget: number,
  percentage: number
) => {
  return (totalBudget * percentage) / 100;
};

const NewOfferList = ({
  items,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
}: NewOfferListProps) => {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden rounded-2xl">
            <CardContent className="p-5">
              <div className="animate-pulse space-y-4">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-8 w-1/2 rounded bg-muted" />
                <div className="h-28 rounded bg-muted" />
                <div className="h-12 rounded bg-muted" />
                <div className="h-10 rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="text-sm font-medium text-Primary">No job offers found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((offer) => {
          const profitAmount = getProfitAmount(
            offer.financials.availableBudgetForExecution,
            offer.financials.adminOfferedServiceFeePercent
          );

          return (
            <Card key={offer.id} className="relative overflow-hidden rounded-2xl">
              <Badge className="absolute right-0 top-0 rounded-bl-lg rounded-br-none rounded-tl-none rounded-tr-none bg-light-green px-3 py-1 text-xs text-white">
                New
              </Badge>

              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2 text-[22px] font-semibold text-Primary">
                  {offer.campaignName}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={offer.client.profileImg ?? ""} />
                    <AvatarFallback>
                      {getInitials(offer.client.brandName)}
                    </AvatarFallback>
                  </Avatar>

                  <p className="text-sm font-medium text-yellow-600">
                    {offer.client.brandName}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Platforms
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {offer.platforms.map((platform) =>
                      platformIcons[platform] ? (
                        <span
                          key={platform}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-light-green/10"
                        >
                          {platformIcons[platform]}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border border-light-green bg-gradient-to-r from-Secondary to-white px-4 py-3">
                  <p className="text-xs font-semibold text-Primary">
                    Total Budget
                  </p>

                  <p className="text-3xl font-semibold text-light-green">
                    {formatCurrency(offer.financials.availableBudgetForExecution)}
                  </p>

                  <Separator className="bg-light-green/60" />

                  <p className="text-sm font-semibold text-Primary">
                    Your Profit ({offer.financials.adminOfferedServiceFeePercent}%)
                    : {formatCurrency(profitAmount)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Platform fee {formatCurrency(offer.financials.adminPlatformFee)} included
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <p className="flex items-center gap-1 text-sm text-yellow-600">
                      <BsFillCalendarDateFill className="text-xs" />
                      Deadline
                    </p>
                    <p className="text-sm text-yellow-600">
                      {formatDate(offer.schedule.deadline)}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="flex items-center gap-1 text-sm text-yellow-600">
                      <BsFillCalendarDateFill className="text-xs" />
                      Duration
                    </p>
                    <p className="text-sm text-yellow-600">
                      {getDurationText(offer.schedule.duration)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-light-green text-white hover:bg-light-green/90">
                    Accept Quote
                  </Button>

                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/${locale}/agency/campaign-details/${offer.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3">
        <span className="text-sm text-muted-foreground">Page</span>

        <span className="flex h-8 min-w-8 items-center justify-center rounded-full border border-light-green bg-Secondary px-3 text-sm text-Primary">
          {page}
        </span>

        <span className="text-sm text-muted-foreground">Of {totalPages}</span>

        <Button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-full bg-light-green text-white hover:bg-light-green/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default NewOfferList;