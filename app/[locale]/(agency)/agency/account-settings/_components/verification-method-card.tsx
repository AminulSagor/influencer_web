"use client";

import { useState } from "react";
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

const VerificationMethodCard = () => {
  // 🔹 Change this to false to test unverified state
  const isVerified = true;

  // 🔹 Mock verified data (normally comes from service)
  const verifiedData = {
    nidNumber: "1998123456789",
    tradeLicense: "TL-987654",
    tinNumber: "123456789012",
    binNumber: "BIN-456789",
  };

  const [formData, setFormData] = useState({
    nidNumber: isVerified ? verifiedData.nidNumber : "",
    tradeLicense: isVerified ? verifiedData.tradeLicense : "",
    tinNumber: isVerified ? verifiedData.tinNumber : "",
    binNumber: isVerified ? verifiedData.binNumber : "",
  });

  return (
    <Card>
      <div className="px-4 py-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-md p-0 hover:no-underline mb-4 text-orange font-semibold">
              Verification Methods
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4 px-1">
                {/* Status Banner */}
                {isVerified ? (
                  <div className="p-2 rounded-md bg-light-green-100 border border-light-green-200">
                    <p className="text-light-green-600 font-medium">
                      Verification Completed
                    </p>
                  </div>
                ) : (
                  <div className="p-2 rounded-md bg-rose-100 border border-rose-200">
                    <p className="flex items-center gap-2 text-rose-600 font-medium">
                      <IoCloseCircle size={18} />
                      Verification Required. Please provide documents
                    </p>
                  </div>
                )}

                {/* Form Grid */}
                <div className="grid grid-cols-12 gap-4">
                  {/* NID Section */}
                  <div className="col-span-12 md:col-span-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-orange">Your NID Number</Label>
                      <Input
                        placeholder="Enter your NID number"
                        value={formData.nidNumber}
                        disabled={isVerified}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nidNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    <NIDUploadFront />
                    <NIDUploadBack />
                  </div>

                  {/* Trade License */}
                  <div className="col-span-12 md:col-span-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-orange">
                        Your Trade License Number
                      </Label>
                      <Input
                        placeholder="Enter your Trade License number"
                        value={formData.tradeLicense}
                        disabled={isVerified}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tradeLicense: e.target.value,
                          })
                        }
                      />
                    </div>

                    <TradeLicenseUpload />
                  </div>

                  {/* TIN & BIN */}
                  <div className="col-span-12 md:col-span-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-orange">Your TIN Number</Label>
                      <Input
                        placeholder="Enter your TIN number"
                        value={formData.tinNumber}
                        disabled={isVerified}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tinNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    <TinCertificateUpload />

                    <div className="space-y-2">
                      <Label className="text-orange">Your BIN Number</Label>
                      <Input
                        placeholder="Enter your BIN number"
                        value={formData.binNumber}
                        disabled={isVerified}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            binNumber: e.target.value,
                          })
                        }
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
