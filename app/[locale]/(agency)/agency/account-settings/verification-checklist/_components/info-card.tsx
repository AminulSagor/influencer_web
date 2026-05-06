import { Button } from "@/components/ui/button";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";
import Image from "next/image";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { PiInstagramLogoFill, PiYoutubeLogoFill } from "react-icons/pi";

type InfoCardProps = {
  status: boolean;
  profile: AgencyProfileResponse | null;
};

const InfoCard = ({ status, profile }: InfoCardProps) => {
  const agencyName = profile?.agencyName?.trim() || "Agency";
  const location = [profile?.address?.zilla, "Bangladesh"]
    .filter(Boolean)
    .join(", ");
  const instagram = profile?.socialLinks?.find(
    (item) => item.platform?.trim().toLowerCase() === "instagram",
  );
  const youtube = profile?.socialLinks?.find(
    (item) => item.platform?.trim().toLowerCase() === "youtube",
  );

  return (
    <div className="bg-linear-to-r from-Primary to-light-green rounded-xl border p-4">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left lg:flex-1 lg:justify-center lg:gap-6">
          <div className="h-28 w-28 overflow-hidden rounded-full sm:h-40 sm:w-40 lg:h-32 lg:w-32">
            <img
              src={profile?.logo || "/avatar/avatar.png"}
              alt="profile image"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              {status ? (
                <h2 className="flex items-center justify-center gap-1 text-lg font-semibold text-off-white sm:justify-start">
                  {agencyName} <MdVerified />
                </h2>
              ) : (
                <h2 className="flex items-center justify-center gap-1 text-lg font-semibold text-off-white sm:justify-start">
                  {agencyName}
                  <BsFillQuestionCircleFill />
                </h2>
              )}

              <p className="text-white">{location || "Bangladesh"}</p>
            </div>

            <div className="inline-block rounded-lg bg-off-white px-4 py-1 text-sm font-semibold">
              {profile?.isVerified ? "Verified" : "UnVerified"}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5 py-2 lg:w-[40%] lg:justify-between lg:py-6">
          <div className="space-y-2">
            <p className="flex items-center justify-center gap-2 break-all text-base text-off-white sm:justify-start lg:text-lg">
              <PiInstagramLogoFill size={28} />
              {instagram?.url || agencyName}
            </p>

            <p className="flex items-center justify-center gap-2 break-all text-base text-off-white sm:justify-start lg:text-lg">
              <PiYoutubeLogoFill size={28} />
              {youtube?.url || agencyName}
            </p>
          </div>

          <div className="flex justify-center sm:justify-start">
            <Button
              className="w-full bg-off-white text-light-green hover:bg-off-white/90 hover:text-light-green sm:w-[200px]"
              size={"sm"}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
