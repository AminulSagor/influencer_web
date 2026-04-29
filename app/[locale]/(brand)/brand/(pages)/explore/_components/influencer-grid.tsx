import Image from "next/image";
import { Music } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import type { JSX } from "react";
import { InfluencerListItem } from "@/types/client/user/influencer";
import RatingStars from "@/app/[locale]/(brand)/brand/(pages)/explore/_components/rating-stars";

type Props = {
  influencers: InfluencerListItem[];
};

function getPlatformIcon(platform: string): JSX.Element | null {
  const iconSize = 16;
  const normalized = platform.toLowerCase();

  const platformIcons: Record<string, JSX.Element> = {
    instagram: <FaInstagram size={iconSize} />,
    youtube: <FaYoutube size={iconSize} />,
    tiktok: <Music size={iconSize} />,
  };

  return platformIcons[normalized] ?? null;
}

function isRemoteImage(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function InfluencerGrid({ influencers }: Props) {
  return (
    <div className="mt-5 grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {influencers.map((influencer) => {
        const avatarSrc = influencer.avatar?.trim() || "";
        const niches = influencer.niches ?? [];
        const platforms = influencer.platforms ?? [];
        const visiblePlatforms = platforms
          .map((platform, index) => ({ platform, index, icon: getPlatformIcon(platform) }))
          .filter((item) => item.icon);

        return (
          <div
            key={influencer.id}
            className="relative flex h-full min-h-[230px] flex-col items-center rounded-md bg-linear-to-b from-Primary/90 to-light-green p-3 text-white/90"
          >
            <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-full bg-white shadow-md">
              {avatarSrc ? (
                isRemoteImage(avatarSrc) ? (
                  <img
                    src={avatarSrc}
                    alt={influencer.name || "Influencer avatar"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src={avatarSrc}
                    alt={influencer.name || "Influencer avatar"}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-Primary">
                  {influencer.name?.charAt(0)?.toUpperCase() || "I"}
                </div>
              )}
            </div>

            <h2 className="mt-2 line-clamp-2 min-h-[46px] text-center text-lg font-semibold leading-6">
              {influencer.name}
            </h2>

            {visiblePlatforms.length > 0 ? (
              <div className="mt-1 flex min-h-[18px] gap-1.5">
                {visiblePlatforms.map(({ platform, index, icon }) => (
                  <div key={`${platform}-${index}`}>{icon}</div>
                ))}
              </div>
            ) : null}

            <div className="mt-1 flex min-h-[30px] flex-wrap items-start justify-center text-center text-xs leading-4">
              {niches.length > 0 ? (
                niches.map((niche, index) => (
                  <span key={`${niche}-${index}`}>
                    {niche}
                    {index < niches.length - 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                <span>No niche added</span>
              )}
            </div>

            <div className="mt-3">
              <RatingStars rating={influencer.rating} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
