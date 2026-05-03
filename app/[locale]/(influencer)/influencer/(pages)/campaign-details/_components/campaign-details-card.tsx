"use client";

import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import { toast } from "sonner";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import { AiFillTikTok } from "react-icons/ai";
import { FaFacebookF, FaTwitter } from "react-icons/fa6";
import { MapPin } from "lucide-react";

import { InfluencerJobService } from "@/service/influencer/job-service";
import { InfluencerAddress, JobDetail } from "@/types/influencer/job_types";

const platformIconMap: Record<string, React.ReactNode> = {
  instagram: <RiInstagramFill size={20} className="fill-light-green" />,
  youtube: <RiYoutubeFill size={20} className="fill-light-green" />,
  tiktok: <AiFillTikTok size={20} className="fill-light-green" />,
  facebook: <FaFacebookF size={16} className="fill-light-green" />,
  twitter: <FaTwitter size={16} className="fill-light-green" />,
  x: <FaTwitter size={16} className="fill-light-green" />,
};

interface CampaignDetailsCardProps {
  job: JobDetail;
  onStatusChange?: () => void;
}

const statusBadge: Record<string, { label: string; className: string }> = {
  new_offer: {
    label: "NEW",
    className:
      "bg-light-green text-white hover:bg-light-green rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
  pending: {
    label: "PENDING",
    className:
      "bg-orange text-white hover:bg-orange rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
  active: {
    label: "ACTIVE",
    className:
      "bg-light-green text-white hover:bg-light-green rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
  completed: {
    label: "COMPLETED",
    className:
      "bg-Primary text-white hover:bg-Primary rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
  declined: {
    label: "DECLINED",
    className:
      "bg-red-500 text-white hover:bg-red-500 rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
};

const toAcceptAddressPayload = (address: InfluencerAddress) => ({
  addressName: address.addressName,
  thana: address.thana,
  zilla: address.zilla,
  fullAddress:
    address.fullAddress ||
    [address.street, address.thana, address.zilla].filter(Boolean).join(", "),
});

const CampaignDetailsCard = ({
  job,
  onStatusChange,
}: CampaignDetailsCardProps) => {
  const t = useTranslations("influencer.campaign-details");
  const locale = useLocale();

  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [clientTermsChecked, setClientTermsChecked] = useState(false);
  const [appTermsChecked, setAppTermsChecked] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState<InfluencerAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const badge = statusBadge[job.status] || {
    label: job.status,
    className:
      "bg-gray-400 text-white hover:bg-gray-400 rounded-full px-3 py-0.5 text-[11px] font-medium",
  };

  const showActions = job.status === "new_offer";

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const submitAccept = async (address?: InfluencerAddress) => {
    try {
      setAccepting(true);
      await InfluencerJobService.acceptJob(
        job.id,
        address ? toAcceptAddressPayload(address) : undefined
      );
      toast.success("Job accepted successfully!");
      setAddressDialogOpen(false);
      onStatusChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept job");
    } finally {
      setAccepting(false);
    }
  };

  const openAddressDialog = async () => {
    setAddressDialogOpen(true);
    setAddressesLoading(true);

    try {
      const res = await InfluencerJobService.getAddresses();
      const nextAddresses = res.data || [];
      setAddresses(nextAddresses);
      const defaultAddress = nextAddresses.find((address) => address.isDefault) || nextAddresses[0];
      setSelectedAddressId(defaultAddress?.id || "");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load addresses");
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!clientTermsChecked || !appTermsChecked) {
      toast.error("Please accept both terms first.");
      return;
    }

    if (job.campaign.needSampleProduct) {
      await openAddressDialog();
      return;
    }

    await submitAccept();
  };

  const handleAcceptWithAddress = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    await submitAccept(selectedAddress);
  };

  const handleDecline = async () => {
    try {
      setDeclining(true);
      await InfluencerJobService.declineJob(job.id);
      toast.success("Job declined.");
      onStatusChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to decline job");
    } finally {
      setDeclining(false);
    }
  };

  const campaignName = job.campaign?.campaignName ?? "";
  const brandName = job.campaign?.client?.brandName ?? "";
  const profileImg = job.campaign?.client?.profileImg ?? "";

  const platforms = Array.from(
    new Set(
      (job.milestones || [])
        .map((m) => m.platform?.toLowerCase())
        .filter((p): p is string => Boolean(p))
    )
  );

  const statusActionLabel = job.status === "declined" ? "Declined Campaign" : "Ongoing Campaign";

  return (
    <>
      <Card className="h-full w-full rounded-[22px] border border-[#e9e9e9] bg-white px-6 py-5 shadow-none">
        <div className="flex h-full flex-col gap-5">
          <Link
            href={`/${locale}/influencer/jobs`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#9a9a9a] transition-colors hover:text-dark-gray"
          >
            <BiLeftArrowAlt className="text-base" />
            {t("Campaign Details")}
          </Link>

          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-semibold leading-none text-[#365314]">
              {campaignName}
            </h2>
            <Badge className={badge.className}>{badge.label}</Badge>
          </div>

          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profileImg || "/avatar/avatar.png"} />
              <AvatarFallback>{brandName?.charAt(0) || "B"}</AvatarFallback>
            </Avatar>
            <p className="text-[14px] font-medium text-[#f28c28]">{brandName}</p>
          </div>

          {platforms.length > 0 && (
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-normal text-[#9a9a9a]">Platforms</p>

              <div className="flex items-center gap-3">
                {platforms.map((p) => (
                  <span key={p} className="flex items-center justify-center">
                    {platformIconMap[p]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {showActions ? (
            <div className="mt-auto space-y-4">
              <div className="space-y-3 pt-1">
                <div className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    id="terms-client"
                    checked={clientTermsChecked}
                    onCheckedChange={(checked) =>
                      setClientTermsChecked(checked === true)
                    }
                    className="h-5 w-5 rounded-[4px] border-[#d8d8d8] data-[state=checked]:border-light-green data-[state=checked]:bg-light-green"
                  />
                  <label
                    htmlFor="terms-client"
                    className="cursor-pointer text-[14px] leading-[1.3] text-[#a3a3a3]"
                  >
                    Confirm you&apos;ve read the client&apos;s terms &amp; conditions
                  </label>
                </div>

                <div className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    id="terms-app"
                    checked={appTermsChecked}
                    onCheckedChange={(checked) => setAppTermsChecked(checked === true)}
                    className="mt-0.5 h-5 w-5 rounded-[4px] border-[#d8d8d8] data-[state=checked]:border-light-green data-[state=checked]:bg-light-green"
                  />
                  <label
                    htmlFor="terms-app"
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

              <div className="flex items-center gap-5 pt-1">
                <Button
                  className="h-11 flex-1 rounded-full bg-light-green text-[15px] font-medium text-white hover:bg-light-green/90"
                  onClick={handleAccept}
                  disabled={accepting || declining || !clientTermsChecked || !appTermsChecked}
                >
                  {accepting ? "Accepting..." : t("Accept")}
                </Button>

                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-full border-[#d0d0d0] bg-white text-[15px] font-medium text-black hover:bg-transparent"
                  onClick={handleDecline}
                  disabled={accepting || declining}
                >
                  {declining ? "Declining..." : t("Decline")}
                </Button>
              </div>
            </div>
          ) : (
            <Button className="mt-auto h-11 w-full rounded-md bg-light-green text-white hover:bg-light-green/90">
              {statusActionLabel}
            </Button>
          )}
        </div>
      </Card>

      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
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
              {addresses.map((address) => {
                const isSelected = address.id === selectedAddressId;
                return (
                  <button
                    key={address.id || address.addressName}
                    type="button"
                    onClick={() => setSelectedAddressId(address.id)}
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

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddressDialogOpen(false)}
              disabled={accepting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-light-green text-white hover:bg-light-green/90"
              onClick={handleAcceptWithAddress}
              disabled={addressesLoading || !selectedAddress || accepting}
            >
              {accepting ? "Accepting..." : "Accept"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CampaignDetailsCard;
