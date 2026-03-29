"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { inviteAssignment } from "@/service/admin/campaign/invite-assignment";
import { getCampaignByIdFromAdmin } from "@/service/admin/campaign/get-campaign";
import {
  fetchRemainingInvitations,
  RemainingInvitationInfluencer,
} from "@/service/admin/campaign/assignment-remain";
import { money } from "@/utils/admin/campaign/campaign_calculation_util";
import toast from "react-hot-toast";

type CampaignMilestoneLite = {
  id: string;
  order?: number;
  campaignId?: string;
};

function roundMoney(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

function splitTotalEvenly(total: number, count: number) {
  if (count <= 0) return [];

  const totalCents = Math.max(0, Math.round((Number(total) || 0) * 100));
  const baseCents = Math.floor(totalCents / count);
  const rem = totalCents - baseCents * count;

  return Array.from({ length: count }, (_, i) =>
    roundMoney((baseCents + (i < rem ? 1 : 0)) / 100)
  );
}

export default function InviteInfluencerBar({
  campaignId,
  selectedInfluencerId,
  onSelectedInfluencerChange,
}: {
  campaignId: string;
  selectedInfluencerId: string;
  onSelectedInfluencerChange: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [campaignLoading, setCampaignLoading] = useState(false);

  const [draftCount, setDraftCount] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [draftedInfluencers, setDraftedInfluencers] = useState<
    RemainingInvitationInfluencer[]
  >([]);

  const [campaignMasterId, setCampaignMasterId] = useState<string>("");
  const [campaignMilestones, setCampaignMilestones] = useState<
    CampaignMilestoneLite[]
  >([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handler = () => setRefreshTrigger((prev) => prev + 1);
    window.addEventListener("influencer-assigned", handler);
    window.addEventListener("app-notification", handler);
    return () => {
      window.removeEventListener("influencer-assigned", handler);
      window.removeEventListener("app-notification", handler);
    };
  }, []);

  const sortedMilestones = useMemo(() => {
    return [...campaignMilestones]
      .filter((m) => String(m?.id ?? "").trim().length > 0)
      .sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0));
  }, [campaignMilestones]);

  const loadCampaign = async () => {
    if (!campaignId) return;

    setCampaignLoading(true);
    try {
      const res = await getCampaignByIdFromAdmin(campaignId);
      const data = res?.data;

      setCampaignMasterId(String(data?.id ?? campaignId));

      const milestones = Array.isArray(data?.milestones)
        ? (data.milestones as CampaignMilestoneLite[])
        : [];

      setCampaignMilestones(milestones);
    } catch (error) {
      toast.error("Failed to load campaign details");
      setCampaignMasterId(campaignId);
      setCampaignMilestones([]);
    } finally {
      setCampaignLoading(false);
    }
  };

  const loadRemaining = async () => {
    if (!campaignId) return;

    setLoading(true);
    try {
      const res = await fetchRemainingInvitations(campaignId);
      const data = res?.data;

      const list = Array.isArray(data?.draftedInfluencers)
        ? (data.draftedInfluencers as RemainingInvitationInfluencer[])
        : [];

      setDraftCount(Number(data?.draftCount ?? list.length ?? 0));
      setRemainingBudget(roundMoney(Number(data?.remainingBudget ?? 0)));
      setDraftedInfluencers(list);

      if (
        !selectedInfluencerId ||
        !list.some((x) => x.id === selectedInfluencerId)
      ) {
        onSelectedInfluencerChange(list?.[0]?.id || "");
      }
    } catch (error) {
      toast.error("Failed to load remaining invitations");
      setDraftCount(0);
      setRemainingBudget(0);
      setDraftedInfluencers([]);
      onSelectedInfluencerChange("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaign();
    loadRemaining();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, refreshTrigger]);

  const selectedInfluencer = useMemo(() => {
    return draftedInfluencers.find((x) => x.id === selectedInfluencerId) || null;
  }, [draftedInfluencers, selectedInfluencerId]);

  const selectedAssignmentId = selectedInfluencer?.assignmentId ?? "";
  const offeredAmount = roundMoney(Number(selectedInfluencer?.offeredAmount ?? 0));

  const milestoneAmount = useMemo(() => {
    const count = sortedMilestones.length;
    if (count <= 0) return 0;
    return roundMoney(offeredAmount / count);
  }, [offeredAmount, sortedMilestones.length]);

  const milestoneSplits = useMemo(() => {
    if (!selectedInfluencer) return [];
    if (sortedMilestones.length === 0) return [];

    const splitAmounts = splitTotalEvenly(offeredAmount, sortedMilestones.length);

    return sortedMilestones.map((milestone, index) => ({
      // this is the MASTER milestone id from getCampaignById
      milestoneId: milestone.id,
      amount: splitAmounts[index] ?? 0,
    }));
  }, [selectedInfluencer, sortedMilestones, offeredAmount]);

  const validMilestoneSplits = useMemo(() => {
    return milestoneSplits.filter(
      (item) => String(item.milestoneId).trim().length > 0
    );
  }, [milestoneSplits]);

  const invitationRemainsText = String(draftCount).padStart(2, "0");

  const handleInvite = async () => {
    if (!selectedAssignmentId) return;
    if (!campaignMasterId) return;
    if (validMilestoneSplits.length === 0) return;

    try {
      setInviting(true);

      await inviteAssignment(selectedAssignmentId, {
        milestoneSplits: validMilestoneSplits,
      });

      await loadRemaining();
      window.dispatchEvent(new Event("influencer-assigned"));
    } catch (error) {
      toast.error("Failed to Assign");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="px-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="md:flex-[2]">
          <Select
            value={selectedInfluencerId}
            onValueChange={onSelectedInfluencerChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  loading || campaignLoading
                    ? "Loading..."
                    : "Select Influencer"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {draftedInfluencers.length === 0 ? (
                <SelectItem value="__none" disabled>
                  No remaining influencers found
                </SelectItem>
              ) : (
                draftedInfluencers.map((inf) => (
                  <SelectItem key={inf.id} value={inf.id}>
                    {inf.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {selectedInfluencer && (
            <div className="mt-1 text-xs text-gray-500">
              Selected: {selectedInfluencer.name}
            </div>
          )}
        </div>

        <div className="md:flex-1">
          <h2 className="text-Primary text-sm font-semibold md:text-lg">
            Offered Amount:
          </h2>
          <p className="text-Primary text-sm font-medium md:text-lg">
            ৳ {money(offeredAmount)}
          </p>
        </div>

        <div className="text-orange md:flex-1">
          <h2 className="text-sm md:text-lg">Remaining amount to distribute:</h2>
          <p className="text-sm font-medium md:text-lg">
            ৳ {money(remainingBudget)}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 md:flex-1 md:items-center md:justify-center">
          <h2 className="text-Primary text-sm font-semibold md:text-lg">
            Invitation Remains: {invitationRemainsText}
          </h2>

          <Button
            variant={"PrimaryGradient"}
            size={"lg"}
            disabled={
              loading ||
              campaignLoading ||
              inviting ||
              !selectedAssignmentId ||
              !campaignMasterId ||
              draftedInfluencers.length === 0 ||
              selectedInfluencerId === "__none" ||
              validMilestoneSplits.length === 0
            }
            onClick={handleInvite}
          >
            {inviting ? "Sending..." : "Send Invitation"}
          </Button>

          <div className="text-xs text-gray-400">
            milestone: ৳{money(milestoneAmount)}
          </div>
        </div>
      </div>
    </div>
  );
}