import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FaClock,
  FaEdit,
  FaInstagram,
  FaLink,
} from "react-icons/fa";
import { SlSocialYoutube } from "react-icons/sl";
import { TbBrandTiktok } from "react-icons/tb";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

type SocialLinksCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
};

const getPlatformIcon = (platform: string) => {
  const normalized = platform.toLowerCase();

  if (normalized === "instagram") return <FaInstagram size={28} />;
  if (normalized === "youtube") return <SlSocialYoutube size={28} />;
  if (normalized === "tiktok") return <TbBrandTiktok size={28} />;

  return <FaLink size={24} />;
};

const SocialLinksCard = ({ profile, isLoading }: SocialLinksCardProps) => {
  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-Primary hover:cursor-pointer hover:no-underline">
              Social Links
            </AccordionTrigger>

            <AccordionContent className="space-y-6">
              <div className="space-y-2">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : profile?.socialLinks?.length ? (
                  profile.socialLinks.map((item, index) => (
                    <div key={`${item.platform}-${index}`} className="flex items-center gap-4">
                      <div>{getPlatformIcon(item.platform)}</div>

                      <div className="flex-1 rounded-2xl border px-4 py-1">
                        {item.url}
                      </div>

                      <div className="flex items-center gap-4">
                        {item.status === "pending" ? (
                          <FaClock className="fill-orange" />
                        ) : null}
                        <FaEdit className="fill-gray-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No social links found.
                  </p>
                )}
              </div>

              <div>
                <Button
                  className="w-full border border-dashed border-light-green bg-transparent text-light-green hover:bg-light-green hover:text-white"
                  size="sm"
                  type="button"
                >
                  + Add another Social Link
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default SocialLinksCard;