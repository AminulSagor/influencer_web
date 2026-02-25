"use client";

import SectionHeader from "./section-header";
import type { InfluencerAddress } from "@/types/admin/user/influencer-verification-profile_type";
import { MapPin } from "lucide-react";

type Props = {
  addresses: InfluencerAddress[];
};

export default function DeliveryLocationsCard({ addresses }: Props) {
  const first = addresses?.[0];

  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <SectionHeader title="Delivery Locations" />

      <div className="mt-5">
        {!first ? (
          <div className="text-sm text-light-gray">No delivery locations found.</div>
        ) : (
          <div className="max-w-xl rounded-xl border border-primary/20 bg-off-white p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-Primary/10 text-Primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-black">
                  {first.addressName || "Address"}
                </div>
                <div className="mt-1 text-sm text-light-gray">{first.fullAddress}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}