"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AiFillTikTok } from "react-icons/ai";
import { BiSolidLeftArrow } from "react-icons/bi";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import RequestToRequote from "./request-to-requote-drawer";
import { useState } from "react";
import type { AgencyCampaignDetails } from "@/types/agency/job-details";
import { acceptAgencyCampaign } from "@/service/agency/new-job-offers";
import { notifyError, notifySuccess } from "@/utils/toast_util";

interface Props {
  isAccepted?: boolean;
  campaign: AgencyCampaignDetails;
  forceQuotedView?: boolean;
  quotationSent?: boolean;
  onQuotationSentChange?: (value: boolean) => void;
}

const CampaignDetailsCard = ({
  isAccepted,
  campaign,
  forceQuotedView = false,
  quotationSent,
  onQuotationSentChange,
}: Props) => {
  const [internalQuotationSent, setInternalQuotationSent] =
    useState(forceQuotedView);
  const isQuotationSent = quotationSent ?? internalQuotationSent;

  const handleQuotationSentChange = (value: boolean) => {
    setInternalQuotationSent(value);
    onQuotationSentChange?.(value);
  };
  const [isAccepting, setIsAccepting] = useState(false);
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  const handleAcceptQuote = async () => {
    try {
      setIsAccepting(true);
      await acceptAgencyCampaign(campaign.id);
      notifySuccess("Quote accepted successfully.");
      router.push(`/${locale}/agency/jobs/quoted`);
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to accept quote.";
      notifyError(message);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Card className="gap-2 h-full">
      <CardHeader>
        <div>
          <Button
            variant="link"
            asChild
            className="has-[>svg]:px-0 text-dark-gray font-medium"
          >
            <Link href={`/${locale}/agency/jobs`}>
              <BiSolidLeftArrow />
              Back to Campaigns
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-8">
          <div>
            <CardTitle className="text-Primary font-semibold text-lg">
              {campaign.campaignName}
            </CardTitle>
          </div>
          <div>
            <Badge className="bg-light-green">New</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={campaign.client.profileImg ?? ""} />
            <AvatarFallback>
              {campaign.client.brandName?.charAt(0) ?? "B"}
            </AvatarFallback>
          </Avatar>
          <p className="text-orange text-sm font-medium">
            {campaign.client.brandName}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <p className="text-muted-foreground text-sm font-medium">Platforms</p>
          <div className="flex gap-2">
            <span>
              <RiInstagramFill size={30} className="fill-light-green" />
            </span>
            <span>
              <RiYoutubeFill size={30} className="fill-light-green" />
            </span>
            <span>
              <AiFillTikTok size={30} className="fill-light-green" />
            </span>
          </div>
        </div>

        {isQuotationSent ? (
          <>
            <div className="pt-2">
              <p className="text-center text-sm text-dark-gray">
                Once The Client Accept Your Quote The Deal Will Be Confirmed.
              </p>
            </div>

            <Button className="w-full bg-orange rounded-full hover:bg-orange/90">
              Quote Sent For Client Review
            </Button>
          </>
        ) : (
          <>
            <div>
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  className="data-[state=checked]:bg-light-green data-[state=checked]:border-light-green"
                  id="terms"
                />
                <p className="text-sm text-dark-gray select-none">
                  You accept the&nbsp;
                  <span className="text-light-green font-medium">
                    <Link
                      href={`/${locale}/agency/user-license-agreement`}
                      className="hover:underline"
                    >
                      user license agreement
                    </Link>
                    &nbsp;
                  </span>
                  &&nbsp;
                  <span className="text-light-green font-medium">
                    <Link
                      href={`/${locale}/agency/terms-and-conditions`}
                      className="hover:underline"
                    >
                      Terms and condition
                    </Link>
                  </span>
                  &nbsp;of our app.
                </p>
              </label>
            </div>

            {isAccepted ? (
              <Button className="w-full rounded-full bg-light-green hover:bg-light-green/90">
                Ongoing Campaign
              </Button>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <Button
                  className="flex-1 rounded-full bg-light-green hover:bg-light-green/90"
                  onClick={handleAcceptQuote}
                  disabled={isAccepting}
                >
                  {isAccepting ? "Accepting..." : "Accept Quote"}
                </Button>

                <RequestToRequote
                  campaignId={campaign.id}
                  setIsQuotationSent={handleQuotationSentChange}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignDetailsCard;