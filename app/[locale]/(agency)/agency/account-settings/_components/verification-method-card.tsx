"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoCloseCircle } from "react-icons/io5";

import NIDUploadBack from "./nid-back-upload";
import NIDUploadFront from "./nid-front-upload";
import TinCertificateUpload from "./tin-certificate-upload";
import TradeLicenseUpload from "./trade-license-upload";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

type VerificationMethodCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
};

const VerificationMethodCard = ({
  profile,
  isLoading,
}: VerificationMethodCardProps) => {
  const isVerified = !!profile?.isVerified;

  return (
    <Card>
      <div className="px-4 py-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-orange hover:no-underline">
              Verification Methods
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4 px-1">
                {isVerified ? (
                  <div className="rounded-md border border-light-green-200 bg-light-green-100 p-2">
                    <p className="font-medium text-light-green-600">
                      Verification Completed
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border border-rose-200 bg-rose-100 p-2">
                    <p className="flex items-center gap-2 font-medium text-rose-600">
                      <IoCloseCircle size={18} />
                      Verification Required. Please provide documents
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 space-y-4 md:col-span-4">
                    <div className="space-y-2">
                      <Label className="text-orange">Your NID Number</Label>
                      <Input
                        placeholder="Enter your NID number"
                        value={isLoading ? "Loading..." : profile?.nidNumber ?? ""}
                        readOnly
                      />
                    </div>

                    <NIDUploadFront />
                    <NIDUploadBack />
                  </div>

                  <div className="col-span-12 space-y-4 md:col-span-4">
                    <div className="space-y-2">
                      <Label className="text-orange">
                        Your Trade License Number
                      </Label>
                      <Input
                        placeholder="Enter your Trade License number"
                        value={
                          isLoading ? "Loading..." : profile?.tradeLicenseNumber ?? ""
                        }
                        readOnly
                      />
                    </div>

                    <TradeLicenseUpload />
                  </div>

                  <div className="col-span-12 space-y-4 md:col-span-4">
                    <div className="space-y-2">
                      <Label className="text-orange">Your TIN Number</Label>
                      <Input
                        placeholder="Enter your TIN number"
                        value={isLoading ? "Loading..." : profile?.tinNumber ?? ""}
                        readOnly
                      />
                    </div>

                    <TinCertificateUpload />

                    <div className="space-y-2">
                      <Label className="text-orange">Your BIN Number</Label>
                      <Input
                        placeholder="Enter your BIN number"
                        value={isLoading ? "Loading..." : profile?.binNumber ?? ""}
                        readOnly
                      />
                    </div>
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

export default VerificationMethodCard;