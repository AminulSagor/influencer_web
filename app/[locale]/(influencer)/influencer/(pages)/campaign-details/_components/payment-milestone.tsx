"use client";

import { MilestoneCarousel } from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/milestone-carousel";
import { Milestone } from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/types/type";
import Image from "next/image";
import { useMemo } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PaymentMilestonesSection({
  milestones,
}: {
  milestones: Milestone[];
}) {
  

  const paidCount = useMemo(
    () =>
      milestones.filter(
        (m) => m.status === "approved" || m.status === "partial_paid"
      ).length,
    [milestones]
  );

  const progressPct = useMemo(() => {
    const total = milestones.length || 1;
    return clamp((paidCount / total) * 100, 0, 100);
  }, [paidCount, milestones.length]);

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="">
              <Image
                src="/influencer-images/milestone flask.png"
                alt="Payment Milestone Icon"
                width={22}
                height={26}
              />
            </div>
            <h2 className="text-lg font-semibold text-Primary">
              Payment Milestones
            </h2>
          </div>

          <div className="flex flex-1 flex-col gap-2 md:mx-8 md:max-w-[520px]">
            <div className="flex justify-between items-center text-xs">
              <h1 className=" text-black"> Progress</h1>

              <p className="font-semibold text-Primary">
                {paidCount} of {milestones.length} Paid
              </p>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#9DB47B]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        <MilestoneCarousel milestones={milestones} />

       
      </div>
    </section>
  );
}
