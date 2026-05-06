import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import {
  FaFacebookF,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa";
import { SlSocialYoutube } from "react-icons/sl";
import { TbBrandTiktok, TbBrandX } from "react-icons/tb";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";
import { useLogout } from "@/hooks/useLogout";
import Link from "next/link";
import { useLocale } from "next-intl";

type BasicInfoCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
};

const getPlatformIcon = (platform: string) => {
  const normalized = platform.trim().toLowerCase();

  if (normalized === "instagram") return <FaInstagram size={24} />;
  if (normalized === "youtube") return <SlSocialYoutube size={24} />;
  if (normalized === "tiktok") return <TbBrandTiktok size={24} />;
  if (normalized === "facebook") return <FaFacebookF size={20} />;
  if (normalized === "linkedin") return <FaLinkedinIn size={20} />;
  if (normalized === "x" || normalized === "twitter") {
    return <TbBrandX size={20} />;
  }
  if (normalized === "pinterest") return <FaPinterestP size={20} />;

  return <FaLink size={20} />;
};

const getDisplayUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const BasicInfoCard = ({ profile, isLoading }: BasicInfoCardProps) => {
  const { logout } = useLogout();
  const location = [profile?.address?.thana, profile?.address?.zilla]
    .filter(Boolean)
    .join(", ");

  const socialLinks = profile?.socialLinks ?? [];

  const logoSrc =
    profile?.logo && profile?.updatedAt
      ? `${profile.logo}${profile.logo.includes("?") ? "&" : "?"}v=${encodeURIComponent(profile.updatedAt)}`
      : (profile?.logo ?? "");

  const locale = useLocale();

  return (
    <div className="h-full overflow-hidden rounded-xl border bg-linear-to-r from-Primary to-light-green p-4">
      <div className="flex h-full min-h-[260px] gap-6 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2">
          <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full bg-off-white">
            {profile?.logo ? (
              <Image
                src={logoSrc}
                alt={profile.agencyName || "Agency logo"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : null}
          </div>

          <div className="inline-block rounded-lg bg-off-white px-4 py-1 text-sm font-semibold">
            <Link
              href={`/${locale}/agency/account-settings/verification-checklist`}
              className="block h-full"
            >
              {profile?.isVerified ? "Verified" : "Unverified"}
            </Link>
          </div>

          <div className="min-w-0">
            <h2 className="flex items-center justify-center gap-1 text-lg font-semibold text-off-white">
              {isLoading ? "Loading..." : profile?.agencyName || "-"}{" "}
              <BsFillQuestionCircleFill />
            </h2>
            <p className="break-words whitespace-normal text-white text-center">
              {isLoading ? "Loading..." : location || "-"}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="min-w-0 space-y-2 overflow-hidden">
            {isLoading ? (
              <>
                <p className="flex items-center gap-2 text-lg text-off-white">
                  <FaLink size={20} />
                  Loading...
                </p>
                <p className="flex items-center gap-2 text-lg text-off-white">
                  <FaLink size={20} />
                  Loading...
                </p>
              </>
            ) : socialLinks.length > 0 ? (
              socialLinks.map((item, index) => (
                <div
                  key={`${item.platform}-${index}`}
                  className="flex min-w-0 items-start gap-2 text-lg text-off-white"
                >
                  <div className="shrink-0 pt-1">
                    {getPlatformIcon(item.platform)}
                  </div>

                  <a
                    href={item.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 cursor-pointer break-all whitespace-normal hover:underline"
                  >
                    {item.url ? getDisplayUrl(item.url) : "-"}
                  </a>
                </div>
              ))
            ) : (
              <>
                <p className="flex items-center gap-2 text-lg text-off-white">
                  <FaLink size={20} />-
                </p>
                <p className="flex items-center gap-2 text-lg text-off-white">
                  <FaLink size={20} />-
                </p>
              </>
            )}
          </div>

          <div className="mt-auto pt-4">
            <Button
              className="w-full cursor-pointer bg-off-white text-light-green hover:bg-off-white/90 hover:text-light-green"
              size="sm"
              type="button"
              onClick={logout}
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
