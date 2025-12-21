import { Card, CardContent } from "@/components/ui/card";
import CampaignDetailsCard from "../_components/campaign-details-card";
import DeadlineCard from "../_components/deadline-card";
import ContentAssetCard from "../_components/content-asset-card";
import { VscPinned } from "react-icons/vsc";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaFileAlt } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import DeloveryLocation from "@/app/[locale]/(influencer)/influencer/campaign-details/_components/delovery-location";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div className="p-4 space-y-4">
      {/* campaign details, deadline and offered amount */}
      <div className="grid md:grid-cols-2 gap-4">
        <CampaignDetailsCard />
        <div className="space-y-1.5">
          <DeadlineCard />
          <Card className=" border-light-gray rounded-lg p-4 shadow-md">
            <h2 className="text-Primary font-semibold ">Offered</h2>
            <h1 className="text-light-green text-2xl md:w-3xl font-semibold">
              ৳ 11,000
            </h1>
          </Card>
        </div>
      </div>

      {/* assets and delivery location */}
      <div className="sm:grid grid-cols-12 gap-4 space-y-2">
        <div className="col-span-8">
          <ContentAssetCard />
        </div>
        <div className=" col-span-4">
          <DeloveryLocation />
        </div>
      </div>

      {/* campaign brief and terms & conditions */}
      <div>
        <Card>
          <CardContent>
            <div className="flex items-start">
              <div className="flex-3 border-r-2 mr-4 space-y-2">
                <div className="text-Primary flex items-center gap-2 mb-6">
                  <span>
                    <FaFileAlt />
                  </span>
                  <h3 className="font-semibold text-base">Campaign Brief</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="text-Primary flex items-center gap-2">
                      <span>
                        <GoGoal />
                      </span>
                      <h3 className="font-semibold text-sm">Campaign Goals</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Promote our new summer skincare line to Gen Z and
                      millennial audiences. Focus on natural ingredients and
                      sustainable packaging.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-Primary flex items-center gap-2">
                      <span>
                        <VscPinned />
                      </span>
                      <h3 className="font-semibold text-sm">
                        Content Requirement
                      </h3>
                    </div>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li className="list-disc ml-5">
                        Minimum 2 Instagram Feed posts
                      </li>
                      <li className="list-disc ml-5">
                        3 stories with swipe up links
                      </li>
                      <li className="list-disc ml-5">
                        1 YouTube short (30-60 seconds)
                      </li>
                      <li className="list-disc ml-5">
                        3 TikTok video Featuring trending sounds
                      </li>
                    </ul>
                  </div>

                  {/* start here */}
                  <div className="space-y-4">
                    <div className="text-Primary flex items-center gap-2">
                      <h3 className="font-semibold text-sm">
                        Do&apos;s and Don&apos;t
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Promote our new summer skincare line to Gen Z and
                      millennial audiences. Focus on natural ingredients and
                      sustainable packaging.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-2">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  defaultValue="item-1"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-md p-0 hover:cursor-pointer hover:no-underline ">
                      <div className="text-Primary flex items-center gap-2 flex-2">
                        <span>
                          <FaFileAlt />
                        </span>
                        <h3 className="font-semibold text-base">
                          Terms & Conditions
                        </h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      <p>
                        Our flagship product combines cutting-edge technology
                        with sleek design. Built with premium materials, it
                        offers unparalleled performance and reliability.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
