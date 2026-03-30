"use client";

import Loader from "@/components/spin-loader";

export default function CampaignDetailsLoading() {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[24px] border border-light-gray bg-white">
        <div className="bg-linear-to-r from-[#6E8F4A] via-[#7A9B57] to-[#8DAE69] p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 space-y-3">
              <div className="h-3 w-24 animate-pulse rounded-full bg-white/25" />
              <div className="h-7 w-52 animate-pulse rounded-full bg-white/30" />

              <div className="flex flex-wrap gap-2 pt-1">
                <div className="h-7 w-20 animate-pulse rounded-full bg-white/20" />
                <div className="h-7 w-24 animate-pulse rounded-full bg-white/20" />
                <div className="h-7 w-16 animate-pulse rounded-full bg-white/20" />
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
              <div className="rounded-[18px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 h-3 w-20 animate-pulse rounded-full bg-white/20" />
                <div className="h-5 w-28 animate-pulse rounded-full bg-white/25" />
              </div>

              <div className="rounded-[18px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 h-3 w-20 animate-pulse rounded-full bg-white/20" />
                <div className="h-5 w-24 animate-pulse rounded-full bg-white/25" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-light-gray bg-white p-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="h-11 animate-pulse rounded-full bg-[#EDF3E8]" />
          <div className="h-11 animate-pulse rounded-full bg-[#F5F7F3]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="rounded-[24px] border border-light-gray bg-white p-6 lg:col-span-3">
          <div className="space-y-4">
            <div className="h-5 w-32 animate-pulse rounded-full bg-[#EEF2EA]" />
            <div className="space-y-3">
              <div className="h-12 animate-pulse rounded-[16px] bg-[#F6F8F4]" />
              <div className="h-12 animate-pulse rounded-[16px] bg-[#F6F8F4]" />
              <div className="h-12 animate-pulse rounded-[16px] bg-[#F6F8F4]" />
              <div className="h-12 animate-pulse rounded-[16px] bg-[#F6F8F4]" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-light-gray bg-white p-6 lg:col-span-4">
          <div className="space-y-4">
            <div className="h-5 w-36 animate-pulse rounded-full bg-[#EEF2EA]" />
            <div className="rounded-[18px] bg-linear-to-r from-[#F8FAF6] via-[#EEF4E8] to-[#F8FAF6] p-5">
              <div className="flex min-h-[180px] flex-col items-center justify-center gap-3">
                <div className="rounded-full bg-white p-3 shadow-sm">
                </div>
                <div className="h-4 w-32 animate-pulse rounded-full bg-[#DCE7D1]" />
                <div className="h-3 w-48 animate-pulse rounded-full bg-[#E8EFE1]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-light-gray bg-white p-6">
        <div className="space-y-4">
          <div className="h-5 w-40 animate-pulse rounded-full bg-[#EEF2EA]" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="h-24 animate-pulse rounded-[18px] bg-[#F6F8F4]" />
            <div className="h-24 animate-pulse rounded-[18px] bg-[#F6F8F4]" />
            <div className="h-24 animate-pulse rounded-[18px] bg-[#F6F8F4]" />
            <div className="h-24 animate-pulse rounded-[18px] bg-[#F6F8F4]" />
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-light-gray bg-white p-6">
        <div className="space-y-4">
          <div className="h-5 w-36 animate-pulse rounded-full bg-[#EEF2EA]" />
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-[18px] bg-[#F6F8F4]" />
            <div className="h-20 animate-pulse rounded-[18px] bg-[#F6F8F4]" />
            <div className="h-20 animate-pulse rounded-[18px] bg-[#F6F8F4]" />
          </div>
        </div>
      </div>
    </div>
  );
}
