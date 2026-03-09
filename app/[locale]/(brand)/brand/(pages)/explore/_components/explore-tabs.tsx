"use client";

import { ExploreType } from "@/app/[locale]/(brand)/brand/(pages)/explore/explore-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  activeType: ExploreType;
};

export default function ExploreTabs({ activeType }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTypeChange = (type: ExploreType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => handleTypeChange("influencer")}
        className={`cursor-pointer ${
          activeType === "influencer"
            ? "rounded-full bg-light-green px-4 py-2 text-white"
            : ""
        }`}
      >
        Influencer
      </button>

      <button
        type="button"
        onClick={() => handleTypeChange("ad-agencies")}
        className={`cursor-pointer ${
          activeType === "ad-agencies"
            ? "rounded-full bg-light-green px-4 py-2 text-white"
            : ""
        }`}
      >
        Ad Agencies
      </button>
    </div>
  );
}
