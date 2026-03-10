import { AiFillTikTok } from "react-icons/ai";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { PiYoutubeLogoFill } from "react-icons/pi";
import StarRating from "./star-rating";
import { Influencer } from "./user-type";
import { IconType } from "react-icons";

interface Props {
  influencer: Influencer;
}

const platformIcons: Record<string, IconType> = {
  instagram: BiLogoInstagramAlt,
  youtube: PiYoutubeLogoFill,
  tiktok: AiFillTikTok,
};

const UserCardItem = ({ influencer }: Props) => {
  return (
    <div className="px-6 py-4 bg-linear-to-r from-light-green to-Primary rounded-md col-span-12 md:col-span-2 flex flex-col items-center text-center gap-1">
      <div className="h-20 rounded-full bg-gray-100 aspect-square" />
      <h2 className="text-white-two text-lg font-semibold">
        {influencer.name}
      </h2>
      {/* Dynamic platform icons */}
      <div className="flex text-white-two gap-2 justify-center">
        {influencer.platforms.map((platform, i) => {
          const Icon = platformIcons[platform.title.toLowerCase()];
          return Icon ? (
            <a
              key={i}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              title={platform.nickName}
            >
              <Icon size={30} />
            </a>
          ) : null;
        })}
      </div>
      <p className="text-xs text-white-two">
        {influencer.niche.map((n, i) => (
          <span key={i}>
            {n}
            {i < influencer.niche.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <div>
        <p className="text-lg font-semibold text-white-two">
          {influencer.jobDone}
        </p>{" "}
        <p className="text-white-two text-sm">Job Done</p>{" "}
      </div>{" "}
      <StarRating max={5} rating={influencer.rating} />{" "}
    </div>
  );
};
export default UserCardItem;
