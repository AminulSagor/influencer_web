import Image from "next/image";
import RatingStars from "@/app/[locale]/(brand)/brand/(pages)/explore/_components/rating-stars";
import { Agency } from "@/app/[locale]/(brand)/brand/(pages)/explore/explore-query";

type Props = {
  agencies: Agency[];
};

function isRemoteImage(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function AgencyGrid({ agencies }: Props) {
  return (
    <div className="mt-5 grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {agencies.map((agency) => {
        const niches = agency.niches ?? [];
        const logoSrc = agency.logo?.trim() || "";
        const ownerName = agency.fullName?.trim() || "";

        return (
          <div
            key={agency.id}
            className="relative flex h-full min-h-[230px] flex-col items-center rounded-md bg-linear-to-b from-Primary/90 to-light-green p-3 text-white/90"
          >
            <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-full bg-white shadow-md">
              {logoSrc ? (
                isRemoteImage(logoSrc) ? (
                  <img
                    src={logoSrc}
                    alt={agency.agencyName || "Agency logo"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src={logoSrc}
                    alt={agency.agencyName || "Agency logo"}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-Primary">
                  {agency.agencyName?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
            </div>

            <h2 className="mt-2 line-clamp-2 min-h-[46px] text-center text-lg font-semibold leading-6">
              {agency.agencyName}
            </h2>

            {ownerName ? (
              <h3 className="mt-0.5 line-clamp-1 min-h-[18px] text-center text-sm leading-5">
                {ownerName}
              </h3>
            ) : null}

            <div className="mt-1 flex min-h-[30px] flex-wrap items-start justify-center text-center text-xs leading-4">
              {niches.length > 0 ? (
                niches.map((item, index) => (
                  <span key={`${item.niche}-${index}`}>
                    {item.niche}
                    {index < niches.length - 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                <span>No niche added</span>
              )}
            </div>

            <div className="mt-3">
              <RatingStars rating={Number(agency.averageRating || 0)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
