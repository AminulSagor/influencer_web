import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PlatformIcon from "./platform-icon";
import StarRating from "./star-rating";
import { InfluencerListItem } from "@/types/admin/user/user_type";

interface Props {
  influencer: InfluencerListItem;
}

const UserCardItem = ({ influencer }: Props) => {
  return (
    <div className="px-6 py-4 bg-linear-to-r from-light-green to-Primary rounded-md flex flex-col items-center text-center gap-2">
      <Avatar className="h-20 w-20">
        <AvatarImage src={influencer.image ?? ""} />
        <AvatarFallback>
          {influencer.name?.[0]?.toUpperCase() ?? "U"}
        </AvatarFallback>
      </Avatar>

      <h2 className="text-white-two text-lg font-semibold">
        {influencer.name}
      </h2>

      <div className="flex text-white-two gap-2 justify-center">
        {influencer.platforms.map((platform, i) => (
          <PlatformIcon
            key={`${platform}-${i}`}
            platform={platform}
            size={24}
            className="text-white-two"
          />
        ))}
      </div>

      <p className="text-xs text-white-two">
        {influencer.niche.length > 0 ? influencer.niche.join(", ") : "No niche"}
      </p>

      <div>
        <p className="text-lg font-semibold text-white-two">
          {influencer.jobDone}
        </p>
        <p className="text-white-two text-sm">Job Done</p>
      </div>

      <StarRating max={5} rating={influencer.rating} />
    </div>
  );
};

export default UserCardItem;