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
  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-md p-0 hover:cursor-pointer hover:no-underline mb-4 text-orange font-semibold">
              Verification Methods
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="p-2 rounded-md bg-rose-100 border border-rose-200">
                  <p className="flex items-center gap-2 text-rose-500">
                    <IoCloseCircle size={18} />
                    Verification Required. Please Provide Documents
                  </p>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-orange">Your Nid Number</Label>
                      <Input
                        className="w-full"
                        placeholder="Enter your NID number"
                      />
                    </div>

                    <NIDUploadFront />
                    <NIDUploadBack />
                  </div>
                  <div className="col-span-12 md:col-span-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-orange">
                        Your Trade License Number
                      </Label>
                      <Input
                        className="w-full"
                        placeholder="Enter your Trade License number"
                      />
                    </div>
                    <TradeLicenseUpload />
                  </div>
                  <div className="col-span-12 md:col-span-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-orange">Your TIN Number</Label>
                      <Input
                        className="w-full"
                        placeholder="Enter your TIN number"
                      />
                    </div>
                    <TinCertificateUpload />
                    <div className="space-y-2">
                      <Label className="text-orange">Your BIN Number</Label>
                      <Input
                        className="w-full"
                        placeholder="Enter your BIN number"
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
