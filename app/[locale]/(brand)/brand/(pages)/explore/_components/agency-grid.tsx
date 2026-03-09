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
    <div className="mt-8 grid grid-cols-2 items-start gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {agencies.map((agency) => {
        const niches = agency.niches ?? [];
        const logoSrc = agency.logo?.trim() || "";

        return (
          <div
            key={agency.id}
            className="bg-linear-to-b from-Primary/90 to-light-green relative flex flex-col items-center rounded-md p-3 text-white/90"
          >
            <div className="relative h-18 w-18 overflow-hidden rounded-full bg-white shadow-md">
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

            <h2 className="mt-2 text-center text-lg font-semibold">
              {agency.agencyName}
            </h2>

            <h3 className="text-sm">{agency.fullName}</h3>

            <div className="mt-1 flex flex-wrap justify-center text-center text-xs">
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

            <div className="mt-6">
              <RatingStars rating={Number(agency.averageRating || 0)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
