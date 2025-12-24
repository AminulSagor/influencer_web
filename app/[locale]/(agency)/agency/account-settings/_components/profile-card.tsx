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

const ProfileCard = () => {
  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-md p-0 hover:cursor-pointer hover:no-underline mb-4 text-Primary font-semibold">
              Profile
            </AccordionTrigger>
            <AccordionContent className="space-y-16">
              <div className="flex justify-between">
                <div className="flex  flex-1 justify-around">
                  <div className="flex flex-col justify-center items-center gap-4">
                    <div className="w-[100px] h-[100px] rounded-full bg-Secondary border border-dashed border-light-green flex items-center justify-center text-light-green">
                      <BiSolidUpArrowCircle size={30} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size={"sm"} variant={"outline"}>
                        Remove
                      </Button>
                      <Button
                        size={"sm"}
                        className="bg-light-green hover:bg-light-green/90"
                      >
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl text-Primary font-semibold">
                        Grow Big
                      </h2>
                      <p className="text-sm text-light-green">
                        Owner: <b>Jahidul Islam</b>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-light-green">
                        <HiLocationMarker size={30} />
                      </div>
                      <div>
                        <p className="text-light-green font-semibold">
                          Bangladesh
                        </p>
                        <p className="text-light-green">Swarupkathi, Dhaka</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-light-green">
                        <div>
                          <MdEmail size={22} />
                        </div>
                        <p>0Mk0Q@example.com</p>
                      </div>
                      <div className="flex items-center gap-2 text-light-green">
                        <div>
                          <FaPhoneAlt size={20} />
                        </div>
                        <p>+8801712345678</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" flex-1 text-end">
                  <Button
                    size={"sm"}
                    className="bg-light-green hover:bg-light-green/90"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 px-1 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-light-green">Agency Name *</Label>
                    <Input placeholder="Enter Agency Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-light-green">First Name *</Label>
                    <Input placeholder="Enter Agency Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-light-green">Last Name *</Label>
                    <Input placeholder="Enter Agency Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-light-green">Thana *</Label>
                    <Input placeholder="Enter Agency Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-light-green">Zilla *</Label>
                    <Input placeholder="Enter Agency Name" />
                  </div>
                </div>
                <div className="col-span-6 space-y-4">
                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">Email Address *</Label>
                    <Input placeholder="grow_big@gmail.com" />
                  </div>
                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">Phone Number *</Label>
                    <Input placeholder="grow_big@gmail.com" />
                  </div>

                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">
                      Secondary Phone Number (Optional)
                    </Label>
                    <Input placeholder="grow_big@gmail.com" />
                  </div>

                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">Full Address *</Label>
                    <Textarea placeholder="Enter Full Address" />
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
