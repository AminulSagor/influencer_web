import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BiSolidUpArrowCircle } from "react-icons/bi";
import { FaPhoneAlt } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

type ProfileCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
};

const ProfileCard = ({ profile, isLoading }: ProfileCardProps) => {
  const ownerName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "";

  const locationLine = [profile?.address?.thana, profile?.address?.zilla]
    .filter(Boolean)
    .join(", ");

  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-Primary hover:cursor-pointer hover:no-underline">
              Profile
            </AccordionTrigger>

            <AccordionContent className="space-y-16">
              <div className="flex justify-between gap-6">
                <div className="flex flex-1 justify-around gap-6">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="relative flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full border border-dashed border-light-green bg-Secondary text-light-green">
                      {profile?.logo ? (
                        <Image
                          src={profile.logo}
                          alt={profile.agencyName || "Agency logo"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <BiSolidUpArrowCircle size={30} />
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" type="button">
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        className="bg-light-green hover:bg-light-green/90"
                        type="button"
                      >
                        Upload Photo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-Primary">
                        {isLoading ? "Loading..." : profile?.agencyName || "-"}
                      </h2>
                      <p className="text-sm text-light-green">
                        Owner: <b>{isLoading ? "Loading..." : ownerName || "-"}</b>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-light-green">
                        <HiLocationMarker size={30} />
                      </div>
                      <div>
                        <p className="font-semibold text-light-green">
                          {isLoading ? "Loading..." : profile?.address?.zilla || "-"}
                        </p>
                        <p className="text-light-green">
                          {isLoading ? "Loading..." : locationLine || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-light-green">
                        <MdEmail size={22} />
                        <p>-</p>
                      </div>

                      <div className="flex items-center gap-2 text-light-green">
                        <FaPhoneAlt size={20} />
                        <p>{isLoading ? "Loading..." : profile?.secondaryPhone || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-end">
                  <Button
                    size="sm"
                    className="bg-light-green hover:bg-light-green/90"
                    type="button"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 space-y-4 px-1">
                  <div className="space-y-2">
                    <Label className="text-light-green">Agency Name *</Label>
                    <Input
                      placeholder="Enter Agency Name"
                      value={isLoading ? "Loading..." : profile?.agencyName ?? ""}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-light-green">First Name *</Label>
                    <Input
                      placeholder="Enter First Name"
                      value={isLoading ? "Loading..." : profile?.firstName ?? ""}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-light-green">Last Name *</Label>
                    <Input
                      placeholder="Enter Last Name"
                      value={isLoading ? "Loading..." : profile?.lastName ?? ""}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-light-green">Thana *</Label>
                    <Input
                      placeholder="Enter Thana"
                      value={isLoading ? "Loading..." : profile?.address?.thana ?? ""}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-light-green">Zilla *</Label>
                    <Input
                      placeholder="Enter Zilla"
                      value={isLoading ? "Loading..." : profile?.address?.zilla ?? ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-span-6 space-y-4">
                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">Email Address *</Label>
                    <Input placeholder="" value="" readOnly />
                  </div>

                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">Phone Number *</Label>
                    <Input placeholder="" value="" readOnly />
                  </div>

                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">
                      Secondary Phone Number (Optional)
                    </Label>
                    <Input
                      placeholder="Enter Secondary Phone Number"
                      value={isLoading ? "Loading..." : profile?.secondaryPhone ?? ""}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">Full Address *</Label>
                    <Textarea
                      placeholder="Enter Full Address"
                      value={isLoading ? "Loading..." : profile?.address?.fullAddress ?? ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default ProfileCard;