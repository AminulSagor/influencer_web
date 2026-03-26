"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import { Globe } from "lucide-react";

import CollapsibleCard from "./collapsible-card";
import RejectReasonModal from "./reject-reason-modal";
import NotifyUser from "./notify-user";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { approveRejectSocial } from "@/service/admin/verification-center/influencer/approve-reject-social";
import { approveRejectAgencySocial } from "@/service/admin/verification-center/agency/approve-reject-social";
import { approveRejectClientSocial } from "@/service/admin/verification-center/brand/approve-reject-social";

type CardStatus = "Pending" | "Rejected" | "Accepted";
type VerificationType = "influencer" | "agency" | "client";

interface SocialLink {
  platform: string;
  handle: string;
  status: CardStatus;
  rejectReason?: string | null;
}

interface Props {
  userId: string;
  socialLinks: SocialLink[];
  verificationType?: VerificationType;
}

const statusBadgeMap: Record<
  Exclude<CardStatus, "Pending">,
  { label: string; className: string }
> = {
  Accepted: {
    label: "Approved",
    className:
      "border-0 bg-[#e8f8ee] px-5 py-2 text-[#078834] hover:bg-[#e8f8ee]",
  },
  Rejected: {
    label: "Rejected",
    className:
      "border-0 bg-[#fff1f0] px-5 py-2 text-[#e73508] hover:bg-[#fff1f0]",
  },
};

const getSocialKey = (item: SocialLink) => `${item.platform}-${item.handle}`;

const getSocialIcon = (platform?: string) => {
  const normalized = (platform ?? "").trim().toLowerCase();

  if (normalized === "instagram") return FaInstagram;
  if (normalized === "youtube") return FaYoutube;
  if (normalized === "tiktok") return FaTiktok;
  if (normalized === "facebook") return FaFacebook;
  if (normalized === "twitter" || normalized === "x") return FaTwitter;

  return Globe;
};

const getDisplayHandle = (url: string, platform?: string) => {
  if (!url) return "N/A";

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/\/+$/, "");
    const segments = pathname.split("/").filter(Boolean);
    const normalized = (platform ?? "").trim().toLowerCase();

    if (normalized === "youtube") {
      const joined = segments.join("/");
      return joined ? `/${joined}` : parsed.hostname.replace(/^www\./, "");
    }

    const lastSegment = segments[segments.length - 1];
    if (!lastSegment) return parsed.hostname.replace(/^www\./, "");

    if (
      normalized === "instagram" ||
      normalized === "tiktok" ||
      normalized === "twitter" ||
      normalized === "x" ||
      normalized === "facebook"
    ) {
      return lastSegment.startsWith("@") ? lastSegment : `@${lastSegment}`;
    }

    return lastSegment;
  } catch {
    return url;
  }
};

const SocialLinksCard = ({
  userId,
  socialLinks,
  verificationType = "influencer",
}: Props) => {
  const router = useRouter();
  const [items, setItems] = useState<SocialLink[]>(socialLinks);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SocialLink | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const submitAction = async ({
    identifier,
    status,
    rejectReason,
  }: {
    identifier: string;
    status: "approved" | "rejected";
    rejectReason?: string;
  }) => {
    if (verificationType === "agency") {
      return approveRejectAgencySocial({
        userId,
        identifier,
        status,
        rejectReason,
      });
    }

    if (verificationType === "client") {
      return approveRejectClientSocial({
        userId,
        url: identifier,
        status,
        rejectionReason: rejectReason,
      });
    }

    return approveRejectSocial({
      userId,
      identifier,
      status,
      rejectReason,
    });
  };

  const updateItem = (
    key: string,
    status: CardStatus,
    rejectReason?: string | null
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        getSocialKey(item) === key
          ? { ...item, status, rejectReason: rejectReason ?? null }
          : item
      )
    );
  };

  const handleApprove = async (item: SocialLink) => {
    const key = getSocialKey(item);

    try {
      setLoadingKey(key);

      await submitAction({
        identifier: item.handle,
        status: "approved",
      });

      updateItem(key, "Accepted");
      router.refresh();
    } catch (error) {
      console.error("approve social failed", error);
    } finally {
      setLoadingKey(null);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedItem) return;

    const key = getSocialKey(selectedItem);

    try {
      setLoadingKey(key);

      await submitAction({
        identifier: selectedItem.handle,
        status: "rejected",
        rejectReason: reason,
      });

      updateItem(key, "Rejected", reason);
      setRejectOpen(false);
      setSelectedItem(null);
      router.refresh();
    } catch (error) {
      console.error("reject social failed", error);
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <>
      <CollapsibleCard
        heading="Social Links"
        action={
          <NotifyUser
            userId={userId}
            targetRole={verificationType}
            reminderKey="social-link"
            customLabel="Social Link"
          />
        }
      >
        <div className="space-y-4">
          {items.map((social, index) => {
            const key = getSocialKey(social);
            const isLoading = loadingKey === key;
            const Icon = getSocialIcon(social.platform);
            const displayHandle = getDisplayHandle(social.handle, social.platform);

            return (
              <div
                key={`${social.platform}-${social.handle}-${index}`}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="shrink-0 text-black">
                    <Icon className="h-6 w-6" />
                  </div>

                  <Link
                    href={social.handle}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-[15px] text-[#2b2b2b] underline underline-offset-4"
                  >
                    {displayHandle}
                  </Link>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className={`min-w-[108px] rounded-2xl ${
                      social.status === "Rejected"
                        ? "border-[#fff1f0] bg-[#fff1f0] text-[#e73508] hover:bg-[#fff1f0]/90"
                        : "border-[#d7d7d7] bg-white text-black hover:bg-[#fafafa]"
                    }`}
                    disabled={isLoading || social.status === "Rejected"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedItem(social);
                      setRejectOpen(true);
                    }}
                  >
                    {isLoading ? "Please wait..." : social.status === "Rejected" ? "Rejected" : "Reject"}
                  </Button>

                  <Button
                    type="button"
                    variant="lightGreen"
                    className={`min-w-[108px] rounded-2xl ${
                      social.status === "Accepted"
                        ? "bg-[#e8f8ee] text-[#078834] hover:bg-[#e8f8ee]/90"
                        : "bg-[#86a857] text-white hover:bg-[#78994d]"
                    }`}
                    disabled={isLoading || social.status === "Accepted"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void handleApprove(social);
                    }}
                  >
                    {isLoading ? "Please wait..." : social.status === "Accepted" ? "Approved" : "Approve"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleCard>

      <RejectReasonModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Write Reject Reason"
        loading={
          !!selectedItem &&
          loadingKey === `${selectedItem.platform}-${selectedItem.handle}`
        }
        onSubmit={handleReject}
      />
    </>
  );
};

export default SocialLinksCard;