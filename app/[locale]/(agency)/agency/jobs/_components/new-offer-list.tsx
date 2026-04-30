"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { AiFillTikTok } from "react-icons/ai";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaFacebookF, FaStar } from "react-icons/fa";
import { RiInstagramFill, RiLinkedinFill, RiYoutubeFill } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { NewJobOfferItem } from "@/types/agency/new-job-offers";
import type { JobTab } from "@/service/agency/new-job-offers";
import { acceptAgencyCampaign } from "@/service/agency/new-job-offers";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type NewOfferListProps = {
  tab: JobTab;
  items: NewJobOfferItem[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const getPlatformIcon = (
  platform: string,
  isDeclinedTab: boolean,
  isPendingTab: boolean
) => {
  const iconClass = isDeclinedTab
    ? "fill-gray-500 text-gray-500"
    : isPendingTab
      ? "fill-orange text-orange"
      : "fill-light-green text-light-green";
  const icons: Record<string, JSX.Element> = {
    instagram: <RiInstagramFill size={18} className={iconClass} />,
    youtube: <RiYoutubeFill size={18} className={iconClass} />,
    tiktok: <AiFillTikTok size={18} className={iconClass} />,
    facebook: <FaFacebookF size={14} className={iconClass} />,
    linkedin: <RiLinkedinFill size={18} className={iconClass} />,
  };
  return icons[platform] ?? null;
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

const getProfitAmount = (totalBudget: number, percentage: number) => {
  return (totalBudget * percentage) / 100;
};

const formatTimeLeftToRequote = (minutes: number) => {
  const safeMinutes = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;
  return `${String(hours).padStart(2, "0")} H : ${String(
    remainingMinutes
  ).padStart(2, "0")} M`;
};

const getDueLabel = (dueDays?: number) => {
  const safeDays = Number(dueDays) || 0;
  if (safeDays <= 1) return "Due: Tomorrow";
  return `Due: ${safeDays} Days`;
};

const getProgressWidth = (progressPercent?: number) => {
  const safe = Number(progressPercent) || 0;
  return Math.min(Math.max(safe, 0), 100);
};

const renderRatingStars = (rating?: string) => {
  const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < safeRating;
        return (
          <FaStar
            key={index}
            size={32}
            className={filled ? "text-[#E0B100]" : "text-gray-400"}
          />
        );
      })}
    </div>
  );
};

const NewOfferList = ({
  tab,
  items,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
}: NewOfferListProps) => {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
  const router = useRouter();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const isNewOfferTab = tab === "new_offer";
  const isQuotedTab = tab === "quoted";
  const [pageInput, setPageInput] = useState(String(page));

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const handlePageInputChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setPageInput(numericValue);

    if (!numericValue) return;

    const nextPage = Math.min(
      Math.max(Number(numericValue), 1),
      Math.max(totalPages, 1)
    );

    setPageInput(String(nextPage));
    onPageChange(nextPage);
  };

  const isActiveTab = tab === "active";
  const isCompletedTab = tab === "completed";
  const isDeclinedTab = tab === "declined";
  const isPendingTab = tab === "pending";

  const handleAcceptQuote = async (campaignId: string) => {
    try {
      setAcceptingId(campaignId);
      await acceptAgencyCampaign(campaignId);
      notifySuccess("Quote accepted successfully.");
      router.push(`/${locale}/agency/jobs/quoted`);
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to accept quote.";
      notifyError(message);
    } finally {
      setAcceptingId(null);
    }
  };

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
          const progressWidth = getProgressWidth(offer.progressPercent);
          const isAccepting = acceptingId === offer.id;

          return (
            <Card
              key={offer.id}
              className={`relative overflow-hidden rounded-2xl ${isDeclinedTab ? "border-gray-300 bg-white" : ""
                }`}
            >
              {/* Hide "New" badge for pending and declined tabs */}
              {isNewOfferTab && (
                <Badge className="absolute right-0 top-0 rounded-bl-lg rounded-br-none rounded-tl-none rounded-tr-none bg-light-green px-3 py-1 text-xs text-white">
                  New
                </Badge>
              )}

              <CardHeader className="pb-2">
                <CardTitle
                  className={`line-clamp-2 text-[22px] font-semibold ${isDeclinedTab ? "text-gray-500" : "text-Primary"
                    }`}
                >
                  {offer.campaignName}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Client */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={offer.client.profileImg ?? ""} />
                    <AvatarFallback>
                      {getInitials(offer.client.brandName)}
                    </AvatarFallback>
                  </Avatar>
                  <p
                    className={`text-sm font-medium ${isDeclinedTab
                      ? "text-gray-500"
                      : isPendingTab
                        ? "text-muted-foreground"
                        : "text-yellow-600"
                      }`}
                  >
                    {offer.client.brandName}
                  </p>
                </div>

                {/* Platforms */}
                <div className="space-y-2">
                  <p
                    className={`text-sm font-medium ${isDeclinedTab ? "text-gray-500" : "text-muted-foreground"
                      }`}
                  >
                    Platforms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {offer.platforms.map((platform) => {
                      const icon = getPlatformIcon(
                        platform,
                        isDeclinedTab,
                        isPendingTab
                      );
                      return icon ? (
                        <span
                          key={platform}
                          className={`flex h-7 w-7 items-center justify-center rounded-md ${isDeclinedTab
                            ? "bg-gray-100"
                            : isPendingTab
                              ? "bg-orange/10"
                              : "bg-light-green/10"
                            }`}
                        >
                          {icon}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Budget Box */}
                <div
                  className={`space-y-2 rounded-lg px-4 py-3 ${isDeclinedTab
                    ? "border border-gray-300 bg-gray-50"
                    : "border border-light-green bg-gradient-to-r from-Secondary to-white"
                    }`}
                >
                  <p
                    className={`text-xs font-semibold ${isDeclinedTab ? "text-gray-500" : "text-orange"
                      }`}
                  >
                    Total Budget
                  </p>
                  <p
                    className={`text-3xl font-semibold ${isDeclinedTab ? "text-gray-500" : "text-orange"
                      }`}
                  >
                    {formatCurrency(
                      offer.financials.availableBudgetForExecution
                    )}
                  </p>
                  <Separator
                    className={
                      isDeclinedTab ? "bg-gray-300" : "bg-light-green/60"
                    }
                  />
                  <p
                    className={`text-sm font-semibold ${isDeclinedTab ? "text-gray-500" : "text-orange"
                      }`}
                  >
                    {isPendingTab
                      ? `Pending : ${formatCurrency(profitAmount)}`
                      : `Your Profit (${offer.financials.adminOfferedServiceFeePercent}%): ${formatCurrency(profitAmount)}`}
                  </p>

                  {/* Hide platform fee for pending, active, completed, declined tabs */}
                  {!isCompletedTab &&
                    !isActiveTab &&
                    !isDeclinedTab &&
                    !isPendingTab && (
                      <p className="text-xs text-muted-foreground">
                        Platform fee{" "}
                        {formatCurrency(offer.financials.adminPlatformFee)}{" "}
                        included
                      </p>
                    )}
                </div>

                {/* Deadline & Duration */}
                <div className="space-y-1">
                  {isCompletedTab ? (
                    <div className="flex justify-between">
                      <p className="flex items-center gap-1 text-sm text-yellow-600">
                        <BsFillCalendarDateFill className="text-xs" />
                        Completed On
                      </p>
                      <p className="text-sm text-yellow-600">
                        {formatDate(offer.completedOn ?? "")}
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <p
                        className={`flex items-center gap-1 text-sm ${isDeclinedTab ? "text-gray-500" : "text-yellow-600"
                          }`}
                      >
                        <BsFillCalendarDateFill className="text-xs" />
                        Deadline
                      </p>
                      <p
                        className={`text-sm ${isDeclinedTab ? "text-gray-500" : "text-yellow-600"
                          }`}
                      >
                        {formatDate(offer.schedule.deadline)}
                      </p>
                    </div>
                  )}

                  {/* Duration — hidden for pending, active, completed, declined tabs */}
                  {!isActiveTab &&
                    !isCompletedTab &&
                    !isDeclinedTab &&
                    !isPendingTab && (
                      <div className="flex justify-between">
                        <p className="flex items-center gap-1 text-sm text-yellow-600">
                          <BsFillCalendarDateFill className="text-xs" />
                          Duration
                        </p>
                        <p className="text-sm text-yellow-600">
                          {getDurationText(offer.schedule.duration)}
                        </p>
                      </div>
                    )}
                </div>

                {isNewOfferTab && (
                  <div className="space-y-1 text-center">
                    <p className="text-[34px] font-semibold leading-none text-orange">
                      {formatTimeLeftToRequote(
                        offer.timeLeftToRequoteMinutes ?? 0
                      )}
                    </p>
                    <p className="text-sm font-semibold text-Primary">
                      Left To Requote
                    </p>
                  </div>
                )}

                {isActiveTab && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-orange bg-orange/10 px-4 py-2 text-center">
                      <p className="text-sm font-medium text-orange">
                        {getDueLabel(offer.dueDays)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-light-green/20">
                        <div
                          className="h-full rounded-full bg-light-green transition-all duration-300"
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                      <p className="text-sm font-medium text-orange">
                        {progressWidth}% Complete
                      </p>
                    </div>
                  </div>
                )}

                {isCompletedTab && (
                  <div className="pt-1">{renderRatingStars(offer.rating)}</div>
                )}

                {/* Action Buttons */}
                {isNewOfferTab ? (
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-light-green text-white hover:bg-light-green/90"
                      onClick={() => handleAcceptQuote(offer.id)}
                      disabled={isAccepting}
                    >
                      {isAccepting ? "Accepting..." : "Accept Quote"}
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link
                        href={`/${locale}/agency/campaign-details/${offer.id}`}
                      >
                        View Details
                      </Link>
                    </Button>
                  </div>
                ) : isQuotedTab ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`/${locale}/agency/campaign-details/${offer.id}?from=quoted`}
                    >
                      View Campaign Details
                    </Link>
                  </Button>
                ) : isActiveTab ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`/${locale}/agency/campaign-details/${offer.id}`}
                    >
                      View Campaign Details
                    </Link>
                  </Button>
                ) : isCompletedTab ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`/${locale}/agency/campaign-details/${offer.id}`}
                    >
                      View Campaign Details
                    </Link>
                  </Button>
                ) : isPendingTab ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`/${locale}/agency/campaign-details/${offer.id}`}
                    >
                      View Campaign Details
                    </Link>
                  </Button>
                ) : isDeclinedTab ? null : (
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`/${locale}/agency/campaign-details/${offer.id}`}
                    >
                      View Details
                    </Link>
                  </Button>
                )}

                {isNewOfferTab && (
                  <p className="text-center text-xs text-muted-foreground">
                    Request to requote within{" "}
                    {formatDate(offer.invitedAt ?? "")}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm text-muted-foreground">Page</span>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={pageInput}
          onChange={(event) => handlePageInputChange(event.target.value)}
          className="flex h-8 w-14 rounded-full border border-light-green bg-Secondary px-2 text-center text-sm text-Primary outline-none"
        />
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
