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
import {
  fetchRemainingInvitations,
  RemainingInvitationInfluencer,
} from "@/service/admin/campaign/assignment-remain";
import { money } from "@/utils/admin/campaign/campaign_calculation_util";

function getAxiosErrorDebug(err: any) {
  // Works for AxiosError and "normal" errors
  const status = err?.response?.status;
  const data = err?.response?.data;
  const message = err?.message;
  const url = err?.config?.url;
  const method = err?.config?.method;
  const baseURL = err?.config?.baseURL;
  const requestData = err?.config?.data;

  return {
    message,
    status,
    url,
    method,
    baseURL,
    requestData,
    responseData: data,
  };
}

export default function InviteInfluencerBar({
  campaignId,
  milestoneCount,
}: {
  campaignId: string;
  milestoneCount: number;
}) {
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);

  const [draftCount, setDraftCount] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [draftedInfluencers, setDraftedInfluencers] = useState<
    RemainingInvitationInfluencer[]
  >([]);

  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string>("");

  const loadRemaining = async () => {
    if (!campaignId) return;

    setLoading(true);
    try {
      const res = await fetchRemainingInvitations(campaignId);
      const data = res?.data;

      console.groupCollapsed("✅ /remain response");
      console.log("campaignId:", campaignId);
      console.log("raw:", res);
      console.log("data:", data);
      console.groupEnd();

      const list = Array.isArray(data?.draftedInfluencers)
        ? (data.draftedInfluencers as RemainingInvitationInfluencer[])
        : [];

      setDraftCount(Number(data?.draftCount ?? list.length ?? 0));
      setRemainingBudget(Number(data?.remainingBudget ?? 0));
      setDraftedInfluencers(list);

      setSelectedInfluencerId((prev) => prev || list?.[0]?.id || "");
    } catch (e) {
      console.error("❌ fetchRemainingInvitations failed:", getAxiosErrorDebug(e));
      setDraftCount(0);
      setRemainingBudget(0);
      setDraftedInfluencers([]);
      setSelectedInfluencerId("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRemaining();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const selectedInfluencer = useMemo(() => {
    return draftedInfluencers.find((x) => x.id === selectedInfluencerId) || null;
  }, [draftedInfluencers, selectedInfluencerId]);

  const selectedAssignmentId = selectedInfluencer?.assignmentId ?? "";
  const offeredAmount = Number(selectedInfluencer?.offeredAmount ?? 0);

  const milestoneAmount = useMemo(() => {
    if (!milestoneCount || milestoneCount <= 0) return 0;
    return offeredAmount / milestoneCount;
  }, [offeredAmount, milestoneCount]);

  const invitationRemainsText = String(draftCount).padStart(2, "0");

  const handleInvite = async () => {
    // ✅ debug before request
    console.groupCollapsed("🚀 Send Invitation click");
    console.log("campaignId:", campaignId);
    console.log("selectedInfluencerId:", selectedInfluencerId);
    console.log("selectedInfluencer:", selectedInfluencer);
    console.log("selectedAssignmentId:", selectedAssignmentId);
    console.groupEnd();

    if (!selectedAssignmentId) {
      console.warn("⚠️ No assignmentId found for selected influencer.");
      return;
    }

    try {
      setInviting(true);
      const res = await inviteAssignment(selectedAssignmentId);

      console.groupCollapsed("✅ inviteAssignment success");
      console.log("assignmentId:", selectedAssignmentId);
      console.log("response:", res?.data ?? res);
      console.groupEnd();

      await loadRemaining();
    } catch (e) {
      // ✅ show full server error payload (usually contains message/validation)
      console.error("❌ inviteAssignment failed:", getAxiosErrorDebug(e));

      // Optional: pretty-print response body if present
      const serverMsg =
        (e as any)?.response?.data?.message ??
        (e as any)?.response?.data?.error ??
        null;
      if (serverMsg) console.error("🧾 server message:", serverMsg);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="px-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* dropdown */}
        <div className="md:flex-[2]">
          <Select
            value={selectedInfluencerId}
            onValueChange={setSelectedInfluencerId}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={loading ? "Loading..." : "Select Influencer"}
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

        {/* offered */}
        <div className="md:flex-1">
          <h2 className="text-Primary text-sm md:text-lg font-semibold">
            Offered Amount:
          </h2>
          <p className="text-Primary text-sm md:text-lg font-medium">
            ৳ {money(offeredAmount)}
          </p>
        </div>

        {/* remaining */}
        <div className="md:flex-1 text-orange">
          <h2 className="text-sm md:text-lg">Remaining amount to distribute:</h2>
          <p className="text-sm md:text-lg font-medium">
            ৳ {money(remainingBudget)}
          </p>
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
              !selectedAssignmentId ||
              draftedInfluencers.length === 0 ||
              selectedInfluencerId === "__none"
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