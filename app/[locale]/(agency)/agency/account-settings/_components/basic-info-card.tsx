import { Button } from "@/components/ui/button";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { PiInstagramLogoFill, PiYoutubeLogoFill } from "react-icons/pi";

const BasicInfoCard = () => {
  return (
    <div className="col-span-12 md:col-span-6 bg-linear-to-r from-Primary to-light-green border p-4 rounded-xl">
      <div className="flex justify-between gap-6">
        <div className="flex flex-col gap-2 justify-center items-center flex-1">
          <div className="w-[100px] h-[100px] rounded-full bg-off-white"></div>

          <div className="bg-off-white px-4 py-1 rounded-lg inline-block text-sm font-semibold">
            Unverified
          </div>

          <div>
            <h2 className="text-off-white text-lg font-semibold flex items-center justify-center gap-1">
              GrowBig <BsFillQuestionCircleFill />
            </h2>
            <p className="text-light-green/40">Dhaka, Bangladesh</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-lg text-off-white">
              <PiInstagramLogoFill size={28} />
              @GrowBig
            </p>
            <p className="flex items-center gap-2 text-lg text-off-white">
              <PiYoutubeLogoFill size={28} />
              GrowBig
            </p>
          </div>
          <div>
            <Button
              className="w-full hover:bg-off-white/90 hover:text-light-green bg-off-white text-light-green"
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

export default BasicInfoCard;
