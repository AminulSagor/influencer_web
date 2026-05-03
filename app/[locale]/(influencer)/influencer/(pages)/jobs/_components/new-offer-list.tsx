"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useMemo, useState, useCallback } from "react";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { InfluencerJobService } from "@/service/influencer/job-service";
import { InfluencerAddress, JobListItem } from "@/types/influencer/job_types";

interface NewOfferListProps {
  search?: string;
  sort?: "high_budget" | "low_budget";
}

const LIMIT = 9;

const getAddressSelectionKey = (address: InfluencerAddress, index = 0) =>
  address.id ||
  [address.addressName, address.fullAddress, address.street, address.thana, address.zilla, index]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .join("-");

const toAcceptAddressPayload = (address: InfluencerAddress) => ({
  addressName: address.addressName,
  thana: address.thana,
  zilla: address.zilla,
  fullAddress:
    address.fullAddress ||
    [address.street, address.thana, address.zilla].filter(Boolean).join(", "),
});

const NewOfferList = ({ search, sort }: NewOfferListProps) => {
  const t = useTranslations("influencer.jobs");
  const locale = useLocale();
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [addressDialogJob, setAddressDialogJob] = useState<JobListItem | null>(null);
  const [addresses, setAddresses] = useState<InfluencerAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressKey, setSelectedAddressKey] = useState<string>("");
  const [clientTermsChecked, setClientTermsChecked] = useState(false);
  const [appTermsChecked, setAppTermsChecked] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await InfluencerJobService.getJobs({
        status: "new_offer",
        search,
        sort,
        page,
        limit: LIMIT,
      });
      setJobs(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [search, sort, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const selectedAddress = useMemo(
    () =>
      addresses.find(
        (address, index) => getAddressSelectionKey(address, index) === selectedAddressKey
      ),
    [addresses, selectedAddressKey]
  );

  const submitAccept = async (jobId: string, address?: InfluencerAddress) => {
    try {
      setActionLoading(jobId);
      await InfluencerJobService.acceptJob(
        jobId,
        address ? toAcceptAddressPayload(address) : undefined
      );
      toast.success("Job accepted successfully!");
      setAddressDialogJob(null);
      setSelectedAddressKey("");
      setClientTermsChecked(false);
      setAppTermsChecked(false);
      fetchJobs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept job");
    } finally {
      setActionLoading(null);
    }
  };

  const openAddressDialog = async (job: JobListItem) => {
    setAddressDialogJob(job);
    setClientTermsChecked(false);
    setAppTermsChecked(false);
    setAddressesLoading(true);

    try {
      const res = await InfluencerJobService.getAddresses();
      const nextAddresses = res.data || [];
      setAddresses(nextAddresses);
      const defaultIndex = nextAddresses.findIndex((address) => address.isDefault);
      const selectedIndex = defaultIndex >= 0 ? defaultIndex : 0;
      const defaultAddress = nextAddresses[selectedIndex];
      setSelectedAddressKey(
        defaultAddress ? getAddressSelectionKey(defaultAddress, selectedIndex) : ""
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load addresses");
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAccept = async (job: JobListItem) => {
    if (job.needSampleProduct) {
      await openAddressDialog(job);
      return;
    }

    await submitAccept(job.id);
  };

  const handleAcceptWithAddress = async () => {
    if (!addressDialogJob) return;

    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    await submitAccept(addressDialogJob.id, selectedAddress);
  };

  const handleDecline = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      await InfluencerJobService.declineJob(jobId);
      toast.success("Job declined.");
      fetchJobs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to decline job");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <div className="mt-4 space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No new job offers available.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="relative overflow-hidden">
            <Badge className="absolute right-0 top-0 rounded-bl-lg rounded-br-none rounded-tl-none rounded-tr-none bg-light-green px-3 py-1 text-xs text-white">
              New
            </Badge>

            <CardHeader>
              <CardTitle className="text-Primary">
                <Link href={`/${locale}/influencer/campaign-details/${job.id}`}>
                  {job.campaignName}
                </Link>
              </CardTitle>

              <CardDescription className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {job.brandName?.charAt(0) || "B"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-yellow-600">
                  {job.brandName}
                </p>
              </CardDescription>

              <CardContent className="space-y-4 p-0">
                <div className="space-y-2 rounded-lg border border-light-green bg-linear-to-r from-Secondary to-white px-4 py-7">
                  <p className="text-xs font-semibold text-Primary">Offered</p>
                  <p className="text-2xl font-semibold text-light-green">
                    ৳{Number(job.offeredAmount).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <p className="flex items-center gap-1 text-sm text-yellow-600">
                      <FaClock /> {t("Deadline")}
                    </p>
                    <p className="text-sm text-yellow-600">
                      {formatDate(job.startingDate)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="flex items-center gap-1 text-sm text-yellow-600">
                      <BsFillCalendarDateFill /> {t("Duration")}
                    </p>
                    <p className="text-sm text-yellow-600">{job.duration} days</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-light-green text-white"
                    onClick={() => handleAccept(job)}
                    disabled={actionLoading === job.id}
                  >
                    {actionLoading === job.id ? "..." : t("Accept")}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDecline(job.id)}
                    disabled={actionLoading === job.id}
                  >
                    {t("Decline")}
                  </Button>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog
        open={Boolean(addressDialogJob)}
        onOpenChange={(open) => {
          if (!open && actionLoading !== addressDialogJob?.id) {
            setAddressDialogJob(null);
            setSelectedAddressKey("");
            setClientTermsChecked(false);
            setAppTermsChecked(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-Primary">
              <MapPin size={20} />
              Where to send the product?
            </DialogTitle>
          </DialogHeader>

          {addressesLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          ) : addresses.length > 0 ? (
            <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
              {addresses.map((address, index) => {
                const addressKey = getAddressSelectionKey(address, index);
                const isSelected = addressKey === selectedAddressKey;
                return (
                  <button
                    key={addressKey}
                    type="button"
                    onClick={() => setSelectedAddressKey(addressKey)}
                    className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition ${
                      isSelected
                        ? "border-light-green bg-Secondary"
                        : "border-gray-200 hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-light-green" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <span className="h-2 w-2 rounded-full bg-light-green" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-medium text-Primary">
                        {address.addressName}
                        {address.isDefault && (
                          <span className="rounded-full bg-light-green/10 px-2 py-0.5 text-xs font-medium text-light-green">
                            Default
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-dark-gray">
                        {address.fullAddress ||
                          [address.street, address.thana, address.zilla]
                            .filter(Boolean)
                            .join(", ")}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No saved addresses found. Please add an address from account settings first.
            </p>
          )}

          <div className="space-y-3 pt-1">
            <div className="flex cursor-pointer items-center gap-3">
              <Checkbox
                id="jobs-terms-client"
                checked={clientTermsChecked}
                onCheckedChange={(checked) => setClientTermsChecked(checked === true)}
                className="h-5 w-5 rounded-[4px] border-[#d8d8d8] data-[state=checked]:border-light-green data-[state=checked]:bg-light-green"
              />
              <label
                htmlFor="jobs-terms-client"
                className="cursor-pointer text-[14px] leading-[1.3] text-[#a3a3a3]"
              >
                Confirm you&apos;ve read the client&apos;s terms &amp; conditions
              </label>
            </div>

            <div className="flex cursor-pointer items-start gap-3">
              <Checkbox
                id="jobs-terms-app"
                checked={appTermsChecked}
                onCheckedChange={(checked) => setAppTermsChecked(checked === true)}
                className="mt-0.5 h-5 w-5 rounded-[4px] border-[#d8d8d8] data-[state=checked]:border-light-green data-[state=checked]:bg-light-green"
              />
              <label
                htmlFor="jobs-terms-app"
                className="cursor-pointer text-[14px] leading-[1.4] text-[#a3a3a3]"
              >
                You accept the{" "}
                <span className="font-medium text-light-green">
                  user license agreement
                </span>{" "}
                &amp;{" "}
                <span className="font-medium text-light-green">
                  Terms and condition
                </span>{" "}
                of our app.
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAddressDialogJob(null);
                setSelectedAddressKey("");
                setClientTermsChecked(false);
                setAppTermsChecked(false);
              }}
              disabled={Boolean(actionLoading)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-light-green text-white hover:bg-light-green/90"
              onClick={handleAcceptWithAddress}
              disabled={
                addressesLoading ||
                !selectedAddress ||
                !clientTermsChecked ||
                !appTermsChecked ||
                actionLoading === addressDialogJob?.id
              }
            >
              {actionLoading === addressDialogJob?.id ? "Accepting..." : "Accept"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewOfferList;
