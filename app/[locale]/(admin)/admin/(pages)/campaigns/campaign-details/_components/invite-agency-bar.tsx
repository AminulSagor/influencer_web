"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { money } from "@/utils/admin/campaign/campaign_calculation_util";

import { fetchCampaignAgencyDrafts } from "@/service/admin/campaign/agency/get-campaign-agency-draft";
import { inviteAgency } from "@/service/admin/campaign/agency/send-invite-agency";
import { AgencyDraftRow } from "@/types/admin/campaign/agency/agency_draft_row";
import { toast } from "sonner";

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
  availableForAgency,
  onRefreshDraft,
}: {
  campaignId: string;
  availableForAgency: number;
  onRefreshDraft?: () => void | Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);

  const [draftRows, setDraftRows] = useState<AgencyDraftRow[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");

  const loadDrafts = useCallback(async () => {
    if (!campaignId) {
      setDraftRows([]);
      setSelectedAgencyId("");
      return;
    }

    try {
      setLoading(true);

      const res: any = await fetchCampaignAgencyDrafts(campaignId);

      const list: AgencyDraftRow[] =
        res?.data?.data ?? res?.data ?? [];

      const drafts = (Array.isArray(list) ? list : []).filter(
        (x) => String(x?.status ?? "").trim().toLowerCase() === "draft"
      );

      setDraftRows(drafts);

      setSelectedAgencyId((prev) => {
        if (prev && drafts.some((x) => String(x?.id) === prev)) {
          return prev;
        }
        return String(drafts?.[0]?.id ?? "");
      });
    } catch (e) {
      toast.error("❌ fetchCampaignAgencyDrafts failed");
      setDraftRows([]);
      setSelectedAgencyId("");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  useEffect(() => {
    const handler = () => loadDrafts();
    window.addEventListener("agency-assigned", handler);
    return () => window.removeEventListener("agency-assigned", handler);
  }, [loadDrafts]);

  const selectedRow = useMemo(() => {
    return draftRows.find((r) => String(r?.id) === selectedAgencyId) || null;
  }, [draftRows, selectedAgencyId]);

  const invitationRemainsText = String(draftRows.length).padStart(2, "0");

  const handleInvite = async () => {
    if (!campaignId || !selectedAgencyId) return;

    try {
      setInviting(true);

      await inviteAgency({
        campaignId,
        agencyId: selectedAgencyId,
      });

      await loadDrafts();
      await onRefreshDraft?.();
      window.dispatchEvent(new Event("agency-assigned"));
    } catch (e) {
      toast.error("Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="px-2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="md:flex-[2]">
          <Select value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loading ? "Loading..." : "Select Agency"} />
            </SelectTrigger>

            <SelectContent>
              {draftRows.length === 0 ? (
                <SelectItem value="__none" disabled>
                  No draft agencies found
                </SelectItem>
              ) : (
                draftRows.map((row) => (
                  <SelectItem key={row.id} value={String(row.id)}>
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

        <div className="md:flex-1">
          <h2 className="text-Primary text-sm font-semibold md:text-lg">
            Offered Amount:
          </h2>
          <p className="text-Primary text-sm font-medium md:text-lg">
            ৳ {money(Number(availableForAgency ?? 0))}
          </p>
        </div>

        <div className="text-orange md:flex-1">
          <h2 className="text-sm md:text-lg">Draft invitations remaining:</h2>
          <p className="text-sm font-medium md:text-lg">
            {invitationRemainsText}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 md:flex-1 md:items-center md:justify-center">
          <h2 className="text-Primary text-sm font-semibold md:text-lg">
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