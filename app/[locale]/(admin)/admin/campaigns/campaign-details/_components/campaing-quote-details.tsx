"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import QuoteTextRow from "./quote-text-row";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IoCheckmarkCircle } from "react-icons/io5";
import Image from "next/image";
import { Platform } from "./campaign-details-card";
import { PiInstagramLogoFill, PiYoutubeLogoFill } from "react-icons/pi";
import { AiFillTikTok } from "react-icons/ai";
export type PlatformKey = "instagram" | "youtube" | "tiktok";
type Props = {
  title?: string;
  revisedCount: number;
  currencySymbol?: string;
  className?: string;
  platform?: Platform[];
};

const CampaignQuoteDetails = ({
  title = "Quote Details",
  revisedCount,
  currencySymbol = "৳",
  className,
  platform,
}: Props) => {
  const [sendQuote, setSendQuote] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const buttonText = sendQuote ? "Quotation Confirmed" : "Send Quote";
  const handleSendQuoteClick = () => {
    setSendQuote(true);
    setIsDialogOpen(true);
  };

  const PLATFORM_ICON_MAP: Record<PlatformKey, React.ElementType> = {
    instagram: PiInstagramLogoFill,
    youtube: PiYoutubeLogoFill,
    tiktok: AiFillTikTok,
  };
  return (
    <>
      <Card className={cn(className)}>
        <CardHeader className="flex flex-row items-center  gap-6">
          <CardTitle className="text-Primary text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <p className="text-gray-400 text-sm">
              Revised: {revisedCount} Times
            </p>
            <div className="w-10 aspect-square rounded-full bg-Secondary flex items-center justify-center text-Primary font-semibold text-xl">
              {currencySymbol}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div>
              <QuoteTextRow text="Base Campaign Bugdet" amount={100000} />
              <QuoteTextRow text="Vat/Tax" vat={15} amount={10000} />
            </div>
            <div className="py-2">
              <Separator />
            </div>
            <div>
              <QuoteTextRow text="Total Campaign Cost" amount={100000} />
              <div className="flex items-center gap-6">
                <p className="whitespace-nowrap">Quote Amount</p>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">
                    {currencySymbol}
                  </span>
                  <Input className="pl-7 text-right text-bold" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            {!sendQuote ? (
              <Button
                className="w-full"
                variant={"lightGreen"}
                onClick={handleSendQuoteClick}
              >
                {buttonText}
              </Button>
            ) : (
              <Button className="w-full" variant={"outline"} disabled>
                {buttonText}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex flex-col items-center space-y-1 text-center w-[380px]">
          <div className="flex flex-col items-center">
            <IoCheckmarkCircle size={60} className="text-light-green" />
            <DialogTitle className="text-Primary mt-2">
              Quotation Sent to Client
            </DialogTitle>
          </div>

          <div className="text-Primary">
            <p>Quotation Amount : ৳110,000</p>
            <p>Revised: 1 Times</p>
          </div>

          <div className="bg-linear-to-r from-Primary to-light-green p-4 rounded-lg">
            <div className="flex items-center text-left gap-4">
              <div className="w-6 aspect-square relative">
                <Image src={"/icons/online-ads-icon.svg"} fill alt="icon" />
              </div>
              <div className="text-white-two">
                <h2 className="text-lg">Summer Fashion Campaign</h2>
                <p>৳115,000</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center text-left gap-4">
              <div className="text-white-two">
                <div className="flex items-center gap-2 text-white-two">
                  Platforms:
                  <div className="flex">
                    {platform?.map((plat, index) => {
                      const Icon = PLATFORM_ICON_MAP[plat.key];

                      return (
                        <div className="text-white-two" key={index}>
                          <Icon size={20} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p>Client</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CampaignQuoteDetails;
