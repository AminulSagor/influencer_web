import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BrandAssetCard from "../_components/brand-asset-card";
import CampaignDetailsCard from "../_components/campaign-details-card";
import ContentAssetCard from "../_components/content-asset-card";
import DeadlineCard from "../_components/deadline-card";
import QuoteDetailsCard from "../_components/quote-details-card";
import RequoteTimeLeftCard from "../_components/requote-time-left-card";
import CampaignBrief from "../_components/campaign-brief";
import PaymentMilestone from "../_components/payment-milestone-card";
import TermsAndConditions from "../_components/terms-and-conditions";
import TotalEarningCard from "../_components/total-earning-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiSolidLeftArrow } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import { AiFillTikTok } from "react-icons/ai";
import { MilestoneIcon, MountainIcon, MountainSnow } from "lucide-react";
import { GoMilestone } from "react-icons/go";
import Image from "next/image";
import MileStoneCard from "../_components/milestone-card";
import { IN_REVIEW, PAID, paymentMileStoneData, TODO } from "./consts";
import MilestoneClient from "./milestone-client";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const isAccepted = true;
  return (
    <div className="p-4 space-y-4">
      {/* 1st row */}
      <div className="grid-cols-12 grid gap-4">
        <div className="col-span-12 sm:col-span-6">
          {isAccepted ? (
            <div className="p-4 rounded-lg bg-linear-to-r from-Primary to-light-green">
              <div>
                <Button
                  variant="link"
                  asChild
                  className="has-[>svg]:px-0 text-dark-gray font-medium"
                >
                  <Link href="/agency/jobs">
                    <BiSolidLeftArrow />
                    Back to Campaigns
                  </Link>
                </Button>
              </div>

              <div className="space-y-2">
                {/* Header */}
                <h2 className="text-lg font-semibold text-Secondary">
                  Summer Fashion Campaign
                </h2>
                {/* avatar */}
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={"https://github.com/ninjastorm24.png"} />
                    <AvatarFallback>N</AvatarFallback>
                  </Avatar>
                  <p className="text-Secondary text-sm font-medium">StyleCO.</p>
                </div>
                {/* platform */}
                <div className="flex items-center gap-6">
                  <p className="text-Secondary text-sm font-medium">
                    Platforms
                  </p>
                  <div className="flex gap-2">
                    <span>
                      <RiInstagramFill size={30} className="fill-Secondary" />
                    </span>
                    <span>
                      <RiYoutubeFill size={30} className="fill-Secondary" />
                    </span>
                    <span>
                      <AiFillTikTok size={30} className="fill-Secondary" />
                    </span>
                  </div>
                </div>
                {/* Button */}
                <div className="mt-6">
                  <Button
                    size="lg"
                    className="
    w-full
    bg-linear-to-r from-Secondary to-white
    text-light-green
    hover:from-Secondary hover:to-white
    hover:text-light-green
    hover:bg-linear-to-r
  "
                  >
                    Ongoing Campaign
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <CampaignDetailsCard />
          )}
        </div>

        {isAccepted && (
          <div className="col-span-12 sm:col-span-6 space-y-4">
            <div>
              <DeadlineCard />
            </div>
            <div>
              <TotalEarningCard />
            </div>
          </div>
        )}

        {!isAccepted && (
          <>
            <div className="col-span-12 sm:col-span-3">
              <RequoteTimeLeftCard />
            </div>
            <div className="col-span-12 sm:col-span-3">
              <DeadlineCard />
            </div>
          </>
        )}
      </div>
      {/* 2nd row */}
      <div className="grid-cols-12 grid gap-4">
        <div className="col-span-12 sm:col-span-4">
          <ContentAssetCard />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <BrandAssetCard />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <QuoteDetailsCard />
        </div>
      </div>
      {/* 3rd row */}
      <div>
        <Card>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start">
              <CampaignBrief />
              <TermsAndConditions />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4 + 5 row */}
      <MilestoneClient isAccepted={isAccepted} />
    </div>
  );
};

export default page;

