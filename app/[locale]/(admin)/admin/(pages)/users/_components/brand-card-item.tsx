import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PlatformIcon from "./platform-icon";
import { BrandListItem } from "@/types/admin/user/user_type";

interface Props {
  brand: BrandListItem;
}

const BrandCardItem = ({ brand }: Props) => {
  return (
    <Link
      href={`/admin/users/brand/${brand.userId}`}
      className="px-6 py-4 bg-linear-to-r from-light-green to-Primary rounded-md flex flex-col items-center text-center gap-2 hover:opacity-95 transition"
    >
      <Avatar className="h-20 w-20">
        <AvatarImage src={brand.image ?? ""} />
        <AvatarFallback>{brand.name?.[0]?.toUpperCase() ?? "B"}</AvatarFallback>
      </Avatar>

      <h2 className="text-white-two text-lg font-semibold">{brand.name}</h2>

      <div className="flex text-white-two gap-2 justify-center">
        {brand.platforms.map((platform, i) => (
          <PlatformIcon
            key={`${brand.userId}-${platform}-${i}`}
            platform={platform}
            size={22}
            className="text-white-two"
          />
        ))}
      </div>

      <p className="text-xs text-white-two">
        {brand.niche.length > 0 ? brand.niche.join(", ") : "No niche"}
      </p>

      <div>
        <p className="text-lg font-semibold text-white-two">{brand.jobPlaced}</p>
        <p className="text-white-two text-sm">Job Placed</p>
      </div>
    </Link>
  );
};

export default BrandCardItem;