"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import SectionHeader from "./section-header";
import type { InfluencerAddress } from "@/types/admin/user/influencer-verification-profile_type";

type Props = {
  firstName: string;
  lastName: string;
  email?: string;
  isEmailVerified?: boolean;
  phone?: string;
  location?: InfluencerAddress;
  profileImage: string | null;
};

export default function ContactCard({
  firstName,
  lastName,
  email,
  isEmailVerified,
  phone,
  location,
  profileImage,
}: Props) {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <div className="flex items-start justify-between">
        <div />
        <button
          type="button"
          className="text-light-gray hover:text-black"
          aria-label="Collapse"
        >
          ^
        </button>
      </div>

      <div className="mt-1 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-5">
          <div className="relative h-40 w-40 overflow-hidden rounded-full bg-Primary/10 ring-2 ring-primary-color/15">
            {profileImage ? (
              <Image src={profileImage} alt={fullName} fill className="object-cover" />
            ) : (
              <div className="h-full w-full border border-dashed border-primary/30 rounded-full" />
            )}
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-Primary">First Name</div>
            <div className="mt-1 text-2xl font-semibold text-black">{firstName || "—"}</div>

            <div className="mt-6 text-sm font-semibold text-Primary">Last Name</div>
            <div className="mt-1 text-2xl font-semibold text-black">{lastName || "—"}</div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7">
          <div className="text-2xl font-semibold text-black">{fullName || "—"}</div>
          <div className="mt-1 text-sm text-Primary">Influencer</div>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-full bg-Primary/10 text-Primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-black">
                  {location?.country || "—"}
                </div>
                <div className="text-sm text-light-gray">
                  {location ? `${location.thana}, ${location.zilla}` : ""}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-full bg-Primary/10 text-Primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-black">Email Address</div>
                  <span className="rounded-full bg-orange/15 px-3 py-1 text-xs font-semibold text-orange">
                    {isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="mt-1 text-sm text-black">{email || "—"}</div>

                <div className="mt-3">
                  <SectionHeader title="" showNotify />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-full bg-Primary/10 text-Primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-black">Phone Number</div>
                <div className="mt-1 text-sm text-black">{phone || "—"}</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-medium text-white hover:brightness-95 active:scale-[0.98]"
            >
              Notify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}