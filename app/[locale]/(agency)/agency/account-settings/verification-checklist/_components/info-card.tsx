import { Button } from "@/components/ui/button";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { PiInstagramLogoFill, PiYoutubeLogoFill } from "react-icons/pi";

type InfoCardProps = {
  status: boolean;
  profile: AgencyProfileResponse | null;
};

const InfoCard = ({ status, profile }: InfoCardProps) => {
  const agencyName = profile?.agencyName?.trim() || "Agency";
  const location = [profile?.address?.zilla, "Bangladesh"].filter(Boolean).join(", ");
  const instagram = profile?.socialLinks?.find(
    (item) => item.platform?.trim().toLowerCase() === "instagram",
  );
  const youtube = profile?.socialLinks?.find(
    (item) => item.platform?.trim().toLowerCase() === "youtube",
  );

  return (
    <div className="col-span-12 md:col-span-6 bg-linear-to-r from-Primary to-light-green border p-4 rounded-xl">
      <div className="flex justify-between gap-6">
        <div className="flex gap-6 justify-center items-center flex-1">
          <div className="w-[200px] h-[200px] rounded-full bg-off-white"></div>
          <div className="space-y-4">
            <div>
              {status ? (
                <h2 className="text-off-white text-lg font-semibold flex items-center  gap-1">
                  {agencyName} <MdVerified className="" />
                </h2>
              ) : (
                <h2 className="text-off-white text-lg font-semibold flex items-center  gap-1">
                  {agencyName}
                  <BsFillQuestionCircleFill />
                </h2>
              )}
              <p className="text-light-green/40">{location || "Bangladesh"}</p>
            </div>
            <div className="bg-off-white px-4 py-1 rounded-lg inline-block text-sm font-semibold">
              {status ? "Verified" : "Unverified"}
            </div>
          </div>
        </div>
        <div className="w-[40%] flex flex-col justify-between py-6">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-lg text-off-white">
              <PiInstagramLogoFill size={28} />
              {instagram?.url || agencyName}
            </p>
            <p className="flex items-center gap-2 text-lg text-off-white">
              <PiYoutubeLogoFill size={28} />
              {youtube?.url || agencyName}
            </p>
          </div>
          <div>
            <Button
              className=" w-[200px] hover:bg-off-white/90 hover:text-light-green bg-off-white text-light-green"
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
