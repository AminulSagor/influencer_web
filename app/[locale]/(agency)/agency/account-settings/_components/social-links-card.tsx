import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { FaClock, FaEdit, FaInstagram } from "react-icons/fa";
import { SlSocialYoutube } from "react-icons/sl";
import { TbBrandTiktok } from "react-icons/tb";

const SocialLinksCard = () => {
  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-md p-0 hover:cursor-pointer hover:no-underline mb-4 text-Primary font-semibold">
              Social Links
            </AccordionTrigger>
            <AccordionContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div>
                    <FaInstagram size={28} />
                  </div>
                  <div className="border px-4 py-1 rounded-2xl flex-1">
                    @Grow_Big
                  </div>

                  <div className="flex items-center gap-4">
                    <FaClock className="fill-orange" />
                    <FaEdit className="fill-gray-500" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <SlSocialYoutube size={28} />
                  </div>
                  <div className="border px-4 py-1 rounded-2xl flex-1">
                    @Grow_Big
                  </div>

                  <div className="flex items-center gap-4">
                    <FaClock className="fill-orange" />
                    <FaEdit className="fill-gray-500" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <TbBrandTiktok size={28} />
                  </div>
                  <div className="border px-4 py-1 rounded-2xl flex-1">
                    @Grow_Big
                  </div>

                  <div className="flex items-center gap-4">
                    <FaClock className="fill-orange" />
                    <FaEdit className="fill-gray-500" />
                  </div>
                </div>
              </div>
              <div>
                <Button
                  className="bg-transparent border border-dashed border-light-green text-light-green hover:bg-light-green hover:text-white w-full"
                  size="sm"
                >
                  + Add another Niche
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
