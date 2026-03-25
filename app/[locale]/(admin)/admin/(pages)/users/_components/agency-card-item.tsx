import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PlatformIcon from "./platform-icon";
import StarRating from "./star-rating";
import { AgencyListItem } from "@/types/admin/user/user_type";

interface Props {
  agency: AgencyListItem;
}

const AgencyCardItem = ({ agency }: Props) => {
  return (
    <Link
      href={`/admin/users/agency/${agency.userId}`}
      className="px-6 py-4 bg-linear-to-r from-light-green to-Primary rounded-md flex flex-col items-center text-center gap-2 hover:opacity-95 transition"
    >
      <Avatar className="h-20 w-20">
        <AvatarImage src={agency.image ?? ""} />
        <AvatarFallback>{agency.name?.[0]?.toUpperCase() ?? "A"}</AvatarFallback>
      </Avatar>

      <h2 className="text-white-two text-lg font-semibold">{agency.name}</h2>

      <div className="flex text-white-two gap-2 justify-center">
        {agency.platforms.map((platform, i) => (
          <PlatformIcon
            key={`${agency.userId}-${platform}-${i}`}
            platform={platform}
            size={22}
            className="text-white-two"
          />
        ))}
      </div>

      <p className="text-xs text-white-two">
        {agency.niche.length > 0 ? agency.niche.join(", ") : "No niche"}
      </p>

      <div>
        <p className="text-lg font-semibold text-white-two">{agency.jobDone}</p>
        <p className="text-white-two text-sm">Job Done</p>
      </div>

      <StarRating max={5} rating={agency.rating} />
    </Link>
  );
};

export default AgencyCardItem;