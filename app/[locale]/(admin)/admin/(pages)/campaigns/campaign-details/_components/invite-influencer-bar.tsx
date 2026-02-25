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

import { fetchCampaignInvitations } from "@/api/admin/campaign/assign-influencer";
import { inviteAssignment } from "@/api/admin/campaign/invite-assignment";
import { splitEqual, money } from "@/utils/admin/campaign/campaign-calculation";

type InvitationRow = {
  jobId: string;
  influencerName: string;
  status?: string; // "draft"
  sentAt?: string;
  respondedAt?: string | null;
};

export default function InviteInfluencerBar({
  campaignId,
  availableForInfluencers,
  milestoneCount,
}: {
  campaignId: string;
  availableForInfluencers: number;
  milestoneCount: number;
}) {
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);

  const [draftRows, setDraftRows] = useState<InvitationRow[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const loadDrafts = async () => {
    if (!campaignId) return;

    setLoading(true);
    try {
      const res: any = await fetchCampaignInvitations(campaignId);

      const list: InvitationRow[] = res?.data?.data ?? [];
      const drafts = (Array.isArray(list) ? list : []).filter(
        (x) => String(x?.status ?? "").toLowerCase() === "draft"
      );

      setDraftRows(drafts);

      // auto-select first draft
      setSelectedJobId((prev) => prev || drafts?.[0]?.jobId || "");
    } catch (e) {
      console.error("❌ fetchCampaignInvitations failed:", e);
      setDraftRows([]);
      setSelectedJobId("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const selectedRow = useMemo(
    () => draftRows.find((r) => r.jobId === selectedJobId) || null,
    [draftRows, selectedJobId]
  );

  // ✅ offered amount per influencer (based on how many drafts are still remaining)
  const { per: offeredAmountPerInfluencer, remainder } = useMemo(() => {
    return splitEqual(availableForInfluencers, draftRows.length);
  }, [availableForInfluencers, draftRows.length]);

  const milestoneAmount = useMemo(() => {
    return splitEqual(offeredAmountPerInfluencer, milestoneCount).per;
  }, [offeredAmountPerInfluencer, milestoneCount]);

  const invitationRemainsText = String(draftRows.length).padStart(2, "0");

  const handleInvite = async () => {
    if (!selectedJobId) return;

    try {
      setInviting(true);
      await inviteAssignment(selectedJobId); // ✅ PATCH no body
      await loadDrafts(); // ✅ refresh UI
    } catch (e) {
      console.error("❌ inviteAssignment failed:", e);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="px-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* dropdown */}
        <div className="md:flex-[2]">
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={loading ? "Loading..." : "Select Influencer"}
              />
            </SelectTrigger>

            <SelectContent>
              {draftRows.length === 0 ? (
                <SelectItem value="__none" disabled>
                  No draft influencers found
                </SelectItem>
              ) : (
                draftRows.map((row) => (
                  <SelectItem key={row.jobId} value={row.jobId}>
                    {row.influencerName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* optional helper text */}
          {selectedRow && (
            <div className="mt-1 text-xs text-gray-500">
              Selected: {selectedRow.influencerName}
            </div>
          )}
        </div>

        {/* offered */}
        <div className="md:flex-1">
          <h2 className="text-Primary text-sm md:text-lg font-semibold">
            Offered Amount:
          </h2>
          <p className="text-Primary text-sm md:text-lg font-medium">
            ৳ {money(offeredAmountPerInfluencer)}
          </p>
        </div>

        {/* remaining */}
        <div className="md:flex-1 text-orange">
          <h2 className="text-sm md:text-lg">Remaining amount to distribute:</h2>
          <p className="text-sm md:text-lg font-medium">৳ {money(remainder)}</p>
        </div>

        {/* CTA */}
        <div className="md:flex-1 flex flex-col items-start md:items-center md:justify-center gap-2">
          <h2 className="text-Primary text-sm md:text-lg font-semibold">
            Invitation Remains: {invitationRemainsText}
          </h2>

          <Button
            variant={"PrimaryGradient"}
            size={"lg"}
            disabled={
              loading ||
              inviting ||
              !selectedJobId ||
              selectedJobId === "__none" ||
              draftRows.length === 0
            }
            onClick={handleInvite}
          >
            {inviting ? "Sending..." : "Send Invitation"}
          </Button>

          {/* debug (optional) */}
          <div className="text-xs text-gray-400">milestone: ৳{money(milestoneAmount)}</div>
        </div>
      </div>
    </div>
  );
}