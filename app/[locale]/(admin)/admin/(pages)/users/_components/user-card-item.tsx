import { AiFillTikTok } from "react-icons/ai";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { PiYoutubeLogoFill } from "react-icons/pi";
import StarRating from "./star-rating";
import { IconType } from "react-icons";
import type { InfluencerListItem } from "@/types/admin/user/influencer-list_type";

interface Props {
  influencer: InfluencerListItem; // ✅ single item, not array
}

const platformIcons: Record<string, IconType> = {
  instagram: BiLogoInstagramAlt,
  youtube: PiYoutubeLogoFill,
  tiktok: AiFillTikTok,
};

const UserCardItem = ({ influencer }: Props) => {
  return (
    <div className="px-6 py-4 bg-linear-to-r from-light-green to-Primary rounded-md col-span-12 md:col-span-2 flex flex-col items-center text-center gap-2">
      {/* avatar */}
      <div className="h-20 w-20 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
        {influencer.avatar ? (
          // if you use next/image in your project, you can replace this with <Image />
          <img
            src={influencer.avatar}
            alt={influencer.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-white-two text-2xl font-semibold">
            {influencer.name?.[0] ?? "U"}
          </span>
        )}
      </div>

      <h2 className="text-white-two text-lg font-semibold">
        {influencer.name}
      </h2>

      {/* platforms (API gives string[]) */}
      <div className="flex text-white-two gap-2 justify-center">
        {(influencer.platforms ?? []).map((p, i) => {
          const key = String(p ?? "").toLowerCase();
          const Icon = platformIcons[key];
          return Icon ? <Icon key={`${key}-${i}`} size={28} /> : null;
        })}
      </div>

      {/* niches */}
      <p className="text-xs text-white-two">
        {(influencer.niches ?? []).map((n, i) => (
          <span key={`${n}-${i}`}>
            {n}
            {i < (influencer.niches?.length ?? 0) - 1 ? ", " : ""}
          </span>
        ))}
      </p>

      {/* stats */}
      <div>
        <p className="text-lg font-semibold text-white-two">
          {influencer.stats?.jobDone ?? 0}
        </p>
        <p className="text-white-two text-sm">Job Done</p>
      </div>

      <StarRating max={5} rating={influencer.rating ?? 0} />
    </div>
  );
};

export default UserCardItem;