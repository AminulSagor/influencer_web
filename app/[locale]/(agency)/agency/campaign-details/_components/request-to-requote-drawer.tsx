"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  requoteAgencyCampaign,
  type RequoteAgencyCampaignPayload,
} from "@/service/agency/new-job-offers";
import { notifyError, notifySuccess } from "@/utils/toast_util";

interface RequestToRequoteProps {
  campaignId: string;
  setIsQuotationSent: (value: boolean) => void;
}

const RequestToRequote = ({
  campaignId,
  setIsQuotationSent,
}: RequestToRequoteProps) => {
  const [open, setOpen] = useState(false);
  const [serviceFeePercent, setServiceFeePercent] = useState("");
  const [dollarRate, setDollarRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const payload: RequoteAgencyCampaignPayload = {};

    const trimmedServiceFeePercent = serviceFeePercent.trim();
    const trimmedDollarRate = dollarRate.trim();

    if (trimmedServiceFeePercent) {
      const parsedServiceFeePercent = Number(trimmedServiceFeePercent);

      if (Number.isNaN(parsedServiceFeePercent)) {
        notifyError("Service fee percent must be a valid number.");
        return;
      }

      payload.proposedServiceFeePercent = parsedServiceFeePercent;
    }

    if (trimmedDollarRate) {
      const parsedDollarRate = Number(trimmedDollarRate);

      if (Number.isNaN(parsedDollarRate)) {
        notifyError("Dollar rate must be a valid number.");
        return;
      }

      payload.proposedDollarRate = parsedDollarRate;
    }

    if (
      payload.proposedServiceFeePercent === undefined &&
      payload.proposedDollarRate === undefined
    ) {
      notifyError("Please provide at least one requote value.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await requoteAgencyCampaign(campaignId, payload);

      notifySuccess(
        response?.message || "Requote submitted successfully."
      );

      setIsQuotationSent(true);
      setOpen(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to submit requote.";
      notifyError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 rounded-full" variant={"outline"}>
          Request To Requote
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-Primary">Requote</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="space-y-2">
            <Label>Requote your change in percentage</Label>
            <Input
              value={serviceFeePercent}
              onChange={(e) => setServiceFeePercent(e.target.value)}
              placeholder="Enter percentage"
              className="border-light-green focus-visible:border-ring focus-visible:ring-light-green/50 focus-visible:ring-2 py-6 text-center font-medium font-4xl text-Primary"
            />
          </div>

          <div className="space-y-2">
            <Label>Write Dollar Rate</Label>
            <Input
              value={dollarRate}
              onChange={(e) => setDollarRate(e.target.value)}
              placeholder="Enter dollar rate"
              className="border-light-green focus-visible:border-ring focus-visible:ring-light-green/50 focus-visible:ring-2 py-6 text-center font-medium font-4xl text-Primary"
            />
          </div>

          <div className="space-y-2">
            <Label>New Requote Overview</Label>
            <div className="border border-light-green p-4 rounded-md bg-linear-to-r from-Secondary to-white space-y-1">
              <div className="flex justify-between items-center text-sm">
                <p>Total Payable By Client</p>
                <p className="text-light-green font-medium">—</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p>Your Profit</p>
                <p className="text-light-green font-medium">—</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p>Platform Charge</p>
                <p className="text-light-green font-medium">—</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p>Actual Profit</p>
                <p className="text-light-green font-medium">—</p>
              </div>

              <div className="mt-4" />

              <div className="flex justify-between items-center text-sm">
                <p>Total Campaign Spent</p>
                <p className="text-light-green font-medium">—</p>
              </div>

              <div className="flex justify-between items-center text-sm">
                <p className="text-Primary font-medium">
                  Campaign Spent in Dollar
                </p>
                <p className="text-light-green font-medium">—</p>
              </div>
            </div>
          </div>

          <div>
            <Button
              className="w-full bg-light-green hover:bg-light-green/90"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Requote to client"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestToRequote;