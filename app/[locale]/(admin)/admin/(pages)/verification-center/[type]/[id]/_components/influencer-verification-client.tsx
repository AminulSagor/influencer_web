"use client";

import { useEffect, useMemo, useState } from "react";
import type { InfluencerVerificationProfile } from "@/types/admin/user/influencer-verification-profile_type";

import ProfileCompletionCard from "./sections/_ui/profile-completion-card";
import ApprovalProgressCard from "./sections/_ui/approval-progress-card";

import NichesCard from "./sections/_ui/niches-card";
import SocialLinksCard from "./sections/_ui/social-links-card";
import SkillsCard from "./sections/_ui/skills-card";
import PayoutSettingsCard from "./sections/_ui/payout-settings-card";
import NidInfoCard from "./sections/_ui/nid-info-card";
import ContactCard from "./sections/_ui/contact-card";
import DeliveryLocationsCard from "./sections/_ui/delivery-locations-card";
import { getInfluencerVerificationProfile } from "@/api/admin/users/influencers/get-influencer-details";
import InfluencerHeroCard from "./sections/_ui/influencer-hero-card";
import { cn } from "@/lib/utils";
import VerificationBreadcrumb from "../../../../users/_components/verification-breadcrumb";

type Props = {
  userId: string;
};

type OverallVerificationStatus = "pending" | "approved" | "rejected";

export default function InfluencerVerificationClient({ userId }: Props) {
  const [data, setData] = useState<InfluencerVerificationProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (aliveRef: { alive: boolean }) => {
    try {
      setLoading(true);
      const res = await getInfluencerVerificationProfile(userId);
      if (!aliveRef.alive) return;
      setData(res.data);
    } catch (e) {
      console.error(e);
      if (!aliveRef.alive) return;
      setData(null);
    } finally {
      if (!aliveRef.alive) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    const aliveRef = { alive: true };
    fetchProfile(aliveRef);

    return () => {
      aliveRef.alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fullName = useMemo(() => {
    if (!data) return "";
    return `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
  }, [data]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-sm text-light-gray">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4">
        <div className="text-sm text-red">Failed to load influencer profile.</div>
      </div>
    );
  }

  const locationLabel =
    data.addresses?.[0]
      ? `${data.addresses[0].zilla}, ${data.addresses[0].country}`
      : "";

  const profileCompletion = calcProfileCompletion(data);

  // ✅ payouts is object: { bank:[], mobileBanking:[] }
  const payoutsCount =
    (data.payouts?.bank?.length ?? 0) + (data.payouts?.mobileBanking?.length ?? 0);

  // ✅ derive overall verification status
  const verificationStatus: OverallVerificationStatus = deriveOverallStatus(data);

  return (
    <div className="p-4 space-y-4">
      {/* Breadcrumb row + rejected badge */}
      <div className="flex items-center justify-between gap-4">
        <VerificationBreadcrumb type="influencer" name={fullName} />

        {/* ✅ Red mark when rejected */}
        {verificationStatus === "rejected" ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-red/30 bg-red/10 px-4 py-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-red text-white text-sm">
              ✕
            </span>
            <span className="text-sm font-semibold text-red">Rejected</span>
          </div>
        ) : null}
      </div>

      {/* TOP */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <InfluencerHeroCard
            name={fullName}
            location={locationLabel}
            profileImage={(data.profileImage ?? data.profileImg) || null}
            isVerified={data.user?.isVerified}
            socialLinks={data.socialLinks ?? []}
          />
        </div>

        <div className="col-span-12 lg:col-span-5">
          <ProfileCompletionCard progress={profileCompletion} bio={data.bio} />
        </div>
      </div>

      {/* APPROVAL PROGRESS */}
      <ApprovalProgressCard
        nichesCount={(data.niches ?? []).length}
        socialLinksCount={(data.socialLinks ?? []).length}
        nidStatus={data.nidVerification?.nidStatus}
        payoutsCount={payoutsCount}
        emailVerified={data.user?.isEmailVerified}
        verificationStatus={verificationStatus} // ✅ NEW (add prop)
        onApproved={async () => {
          const aliveRef = { alive: true };
          await fetchProfile(aliveRef);
        }}
      />

      {/* REVIEW ROW */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <NichesCard niches={data.niches ?? []} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <SocialLinksCard socialLinks={data.socialLinks ?? []} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <SkillsCard skills={data.skills ?? []} />
        </div>
      </div>

      {/* PAYOUT + NID + CONTACT */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <PayoutSettingsCard payouts={data.payouts} />
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-4">
          <NidInfoCard
            nidNumber={data.nidNumber}
            frontImg={data.nidFrontImg}
            backImg={data.nidBackImg}
            status={data.nidVerification?.nidStatus}
            onUpdated={async () => {
              const aliveRef = { alive: true };
              await fetchProfile(aliveRef);
            }}
          />

          <ContactCard
            firstName={data.firstName}
            lastName={data.lastName}
            email={data.user?.email}
            isEmailVerified={data.user?.isEmailVerified}
            phone={data.user?.phone}
            location={data.addresses?.[0]}
            profileImage={(data.profileImage ?? data.profileImg) || null}
          />
        </div>
      </div>

      <DeliveryLocationsCard addresses={data.addresses ?? []} />
    </div>
  );
}

function calcProfileCompletion(data: InfluencerVerificationProfile) {
  let score = 0;
  const total = 8;

  if (data.firstName) score++;
  if (data.lastName) score++;
  if (data.bio) score++;
  if (data.profileImage || data.profileImg) score++;
  if ((data.socialLinks ?? []).length > 0) score++;
  if ((data.niches ?? []).length > 0) score++;
  if (data.nidNumber) score++;
  if ((data.addresses ?? []).length > 0) score++;

  return Math.round((score / total) * 100);
}

/**
 * ✅ Best-effort overall status:
 * - If backend gives a top-level status in future, use that first.
 * - Else infer: any rejectReason OR any rejected sub-status => rejected
 * - Else if all key items complete/approved => approved
 * - Else pending
 */
function deriveOverallStatus(data: InfluencerVerificationProfile): "pending" | "approved" | "rejected" {
  const nid = data.nidVerification?.nidStatus;

  const hasRejectedNid = nid === "rejected";
  const hasRejectReason =
    Boolean(data.nidVerification?.nidRejectReason?.trim());

  if (hasRejectedNid || hasRejectReason) return "rejected";

  const nichesOk = (data.niches ?? []).length > 0;
  const socialsOk = (data.socialLinks ?? []).length > 0;
  const payoutsOk =
    (data.payouts?.bank?.length ?? 0) + (data.payouts?.mobileBanking?.length ?? 0) > 0;

  const emailOk = Boolean(data.user?.isEmailVerified);
  const nidOk = nid === "approved";

  if (nichesOk && socialsOk && payoutsOk && emailOk && nidOk) return "approved";

  return "pending";
}