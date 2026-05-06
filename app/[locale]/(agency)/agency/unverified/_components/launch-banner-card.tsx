import { Star } from "lucide-react";

export function LaunchBannerCard() {
  return (
    <section className="rounded-xl bg-gradient-to-r from-[#436f30] to-[#7b9d58] px-5 py-7 text-center text-white shadow-sm">
      <Star className="mx-auto mb-2 size-5 fill-white" />

      <h1 className="text-base font-semibold sm:text-lg">Almost There</h1>

      <p className="mx-auto mt-2 max-w-[360px] text-xs leading-relaxed text-white/95 sm:text-sm">
        Complete Verification To Unlock Your Full Dashboard With Earnings,
        Active Jobs, And New Opportunities.
      </p>
    </section>
  );
}
