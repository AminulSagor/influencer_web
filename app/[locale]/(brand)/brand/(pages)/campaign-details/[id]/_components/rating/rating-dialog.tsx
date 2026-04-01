"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCampaignRateableEntities,
  normalizeRating,
} from "./rating-card.utils";
import RatingEntityRow from "./rating-entity-row";
import {
  rateCampaignClient,
  rateInfluencer,
} from "@/service/client/campaigns/campaign-rating";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";
import Loader from "@/components/spin-loader";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type RatingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: ClientCampaignDetails;
  title: string;
};

export default function RatingDialog({
  open,
  onOpenChange,
  campaign,
  title,
}: RatingDialogProps) {
  const entities = React.useMemo(
    () => getCampaignRateableEntities(campaign),
    [campaign],
  );

  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [ratings, setRatings] = React.useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const initialRatings: Record<string, number> = {};

    if (campaign.campaignType === "influencer_promotion") {
      for (const entity of entities) {
        initialRatings[entity.id] = 0;
      }
    } else {
      initialRatings[campaign.id] = Number(campaign.rating || 0);
    }

    setRatings(initialRatings);
    setExpandedId(null);
    setIsSubmitted(false);
  }, [open, campaign, entities]);

  const allRated =
    entities.length > 0 &&
    (campaign.campaignType === "influencer_promotion"
      ? entities.every((entity) => (ratings[entity.id] ?? 0) > 0)
      : (ratings[campaign.id] ?? 0) > 0);

  const totalSelected = Object.values(ratings).filter(
    (value) => value > 0,
  ).length;

  const handleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleChange = (key: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [key]: normalizeRating(value),
    }));
    setIsSubmitted(false);
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: unknown }).response === "object" &&
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message
    ) {
      return (error as { response?: { data?: { message?: string } } }).response!
        .data!.message!;
    }

    return "Something went wrong while submitting your ratings.";
  };

  const handleSubmit = async () => {
    if (!allRated || isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (campaign.campaignType === "influencer_promotion") {
        await Promise.all(
          entities.map((entity) =>
            rateInfluencer({
              campaignId: campaign.id,
              influencerId: entity.id,
              rating: ratings[entity.id] ?? 0,
            }),
          ),
        );
      } else {
        await rateCampaignClient({
          campaignId: campaign.id,
          rating: ratings[campaign.id] ?? 0,
        });
      }

      setExpandedId(null);
      setIsSubmitted(true);
      notifySuccess("Ratings submitted successfully.");
    } catch (error) {
      notifyError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const helperText = isSubmitted
    ? "Your ratings have been submitted."
    : totalSelected > 0
      ? `You have rated ${totalSelected} of ${
          campaign.campaignType === "influencer_promotion" ? entities.length : 1
        }.`
      : "You haven’t submitted your ratings yet.";

  const rows =
    campaign.campaignType === "influencer_promotion"
      ? entities.map((entity) => ({
          key: entity.id,
          entity,
          ratingKey: entity.id,
        }))
      : entities.map((entity) => ({
          key: entity.id,
          entity,
          ratingKey: campaign.id,
        }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-none bg-[#F8F8F8] p-0 shadow-xl">
        <div className="px-7 pb-7 pt-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-left text-base font-semibold text-[#345C21]">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {rows.map(({ key, entity, ratingKey }) => (
              <RatingEntityRow
                key={key}
                entity={entity}
                value={ratings[ratingKey] ?? 0}
                expanded={expandedId === key}
                onExpand={() => handleExpand(key)}
                onChange={(value) => handleChange(ratingKey, value)}
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!allRated || isSubmitting}
            className="mt-8 h-[54px] w-full rounded-[16px] bg-[#5D8238] text-sm font-medium text-white hover:bg-[#4f6f2f] disabled:bg-[#9AA58B] disabled:text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="h-5 w-5 border-2" />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Your Ratings"
            )}
          </Button>

          <p className="mt-3 text-center text-sm text-[#A0A0A0]">
            {helperText}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
