"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CampaignStatus } from "@/types/admin/campaign/campaign-ui_type";

export default function StatusSelect({
    value,
    onChange,
    className,
}: {
    value: CampaignStatus;
    onChange: (v: CampaignStatus) => void;
    className?: string;
}) {
    return (
        <Select value={value} onValueChange={(v) => onChange(v as CampaignStatus)}>
            <SelectTrigger className={className}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>

                <SelectItem value="pending_influencer">Pending Influencer</SelectItem>
                <SelectItem value="pending_agency">Pending Agency</SelectItem>

                <SelectItem value="agency_negotiating">Agency Negotiating</SelectItem>
                <SelectItem value="agency_accepted">Agency Accepted</SelectItem>

                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>

                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>

        </Select>
    );
}
