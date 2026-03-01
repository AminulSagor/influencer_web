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

import { money } from "@/utils/admin/campaign/campaign_calculation_util";

import {
  fetchCampaignAgencyDrafts
} from "@/api/admin/campaign/agency/get-campaign-agency-draft";
import { inviteAgency } from "@/api/admin/campaign/agency/send-invite-agency";
import { AgencyDraftRow } from "@/types/admin/campaign/agency/agency_draft_row";

function fullName(row: AgencyDraftRow) {
  return (
    String(row?.agencyName ?? "").trim() ||
    `${String(row?.firstName ?? "").trim()} ${String(
      row?.lastName ?? ""
    ).trim()}`.trim() ||
    "Agency"
  );
}

export default function InviteAgencyBar({
  campaignId,
  availableForAgency, // ✅ fixed amount for ALL agencies
  onRefreshDraft,
}: {
  campaignId: string;
  availableForAgency: number;
  onRefreshDraft?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);

  const [draftRows, setDraftRows] = useState<AgencyDraftRow[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");

  const loadDrafts = async () => {
    if (!campaignId) return;

    setLoading(true);
    try {
      const res: any = await fetchCampaignAgencyDrafts(campaignId);

      const list: AgencyDraftRow[] = res?.data?.data ?? [];

      const drafts = (Array.isArray(list) ? list : []).filter(
        (x) => String(x?.status ?? "").toLowerCase() === "draft"
      );

      setDraftRows(drafts);

      setSelectedAgencyId((prev) => prev || drafts?.[0]?.id || "");
    } catch (e) {
      console.error("❌ fetchCampaignAgencyDrafts failed:", e);
      setDraftRows([]);
      setSelectedAgencyId("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const selectedRow = useMemo(
    () => draftRows.find((r) => r.id === selectedAgencyId) || null,
    [draftRows, selectedAgencyId]
  );

  const invitationRemainsText = String(draftRows.length).padStart(2, "0");

  const handleInvite = async () => {
    if (!campaignId || !selectedAgencyId) return;

    try {
      setInviting(true);

      await inviteAgency({
        campaignId,
        agencyId: selectedAgencyId, // ✅ id from your response
      });

      await loadDrafts(); // refresh dropdown
      onRefreshDraft?.(); // refresh parent table
    } catch (e) {
      console.error("❌ inviteAgency failed:", e);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="px-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* dropdown */}
        <div className="md:flex-[2]">
          <Select value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={loading ? "Loading..." : "Select Agency"}
              />
            </SelectTrigger>

            <SelectContent>
              {draftRows.length === 0 ? (
                <SelectItem value="__none" disabled>
                  No draft agencies found
                </SelectItem>
              ) : (
                draftRows.map((row) => (
                  <SelectItem key={row.id} value={row.id}>
                    {fullName(row)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {selectedRow && (
            <div className="mt-1 text-xs text-gray-500">
              Selected: {fullName(selectedRow)}
            </div>
          )}
        </div>

        {/* offered amount (FIXED) */}
        <div className="md:flex-1">
          <h2 className="text-Primary text-sm md:text-lg font-semibold">
            Offered Amount:
          </h2>
          <p className="text-Primary text-sm md:text-lg font-medium">
            ৳ {money(availableForAgency)}
          </p>
        </div>

        {/* remaining count */}
        <div className="md:flex-1 text-orange">
          <h2 className="text-sm md:text-lg">
            Draft invitations remaining:
          </h2>
          <p className="text-sm md:text-lg font-medium">
            {invitationRemainsText}
          </p>
        </div>

        {/* CTA */}
        <div className="md:flex-1 flex flex-col items-start md:items-center md:justify-center gap-2">
          <h2 className="text-Primary text-sm md:text-lg font-semibold">
            Invitation Remains: {invitationRemainsText}
          </h2>

          <Button
            variant={"PrimaryGradient" as any}
            size={"lg" as any}
            disabled={
              loading ||
              inviting ||
              !selectedAgencyId ||
              selectedAgencyId === "__none" ||
              draftRows.length === 0
            }
            onClick={handleInvite}
          >
            {inviting ? "Sending..." : "Send Invitation"}
          </Button>
        </div>
      </div>
    </div>
  );
}