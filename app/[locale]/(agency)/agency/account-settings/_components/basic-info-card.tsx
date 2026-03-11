import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { PiInstagramLogoFill, PiYoutubeLogoFill } from "react-icons/pi";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

type BasicInfoCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
};

const getPlatformHandle = (
  profile: AgencyProfileResponse | null,
  platform: string
) => {
  const matched = profile?.socialLinks.find(
    (item) => item.platform.toLowerCase() === platform.toLowerCase()
  );

  if (!matched?.url) return "";

  try {
    const url = new URL(matched.url);
    return url.pathname.replace(/\//g, "") || matched.url;
  } catch {
    return matched.url;
  }
};

const BasicInfoCard = ({ profile, isLoading }: BasicInfoCardProps) => {
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "";
  const location = [profile?.address?.thana, profile?.address?.zilla]
    .filter(Boolean)
    .join(", ");

  const instagramHandle = getPlatformHandle(profile, "Instagram");
  const youtubeHandle = getPlatformHandle(profile, "YouTube");

  return (
    <div className="rounded-xl border bg-linear-to-r from-Primary to-light-green p-4">
      <div className="flex justify-between gap-6">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full bg-off-white">
            {profile?.logo ? (
              <Image
                src={profile.logo}
                alt={profile.agencyName || "Agency logo"}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="inline-block rounded-lg bg-off-white px-4 py-1 text-sm font-semibold">
            {profile?.isVerified ? "Verified" : "Unverified"}
          </div>

          <div>
            <h2 className="flex items-center justify-center gap-1 text-lg font-semibold text-off-white">
              {isLoading ? "Loading..." : profile?.agencyName || "-"}{" "}
              <BsFillQuestionCircleFill />
            </h2>
            <p className="text-light-green/40">
              {isLoading ? "Loading..." : location || "-"}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-lg text-off-white">
              <PiInstagramLogoFill size={28} />
              {isLoading ? "Loading..." : instagramHandle || "-"}
            </p>
            <p className="flex items-center gap-2 text-lg text-off-white">
              <PiYoutubeLogoFill size={28} />
              {isLoading ? "Loading..." : youtubeHandle || fullName || "-"}
            </p>
          </div>

          <div>
            <Button
              className="w-full bg-off-white text-light-green hover:bg-off-white/90 hover:text-light-green"
              size="sm"
              type="button"
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoCard;