import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FaUserEdit } from "react-icons/fa";

const SubmissionHistory = () => {
  return (
    <div className="mt-8 space-y-4">
      <div className="border rounded-lg px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="value-1">
            <AccordionTrigger className="hover:no-underline cursor-pointer">
              <div className="flex items-center gap-4 ">
                <p className="text-xl">Submission 1</p>
                <Badge className="bg-light-green">Approved</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="space-y-2">
                  <p className="text-lg flex items-center gap-2">
                    <FaUserEdit size={20} />
                    Description / Update (Optional)
                  </p>
                  <div className="px-1">
                    <Textarea
                      placeholder="Description of the proof will be visible here"
                      disabled
                    />
                  </div>
                </div>
                <Card>
                  <CardContent className="grid grid-cols-6">
                    <div className="space-y-8 col-span-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <FaUserEdit size={20} />
                          platform 1
                        </p>
                        <p>facebook.com/hania/live</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <FaUserEdit size={20} />
                          Performance Metrics
                        </p>
                        <p className="text-xl font-semibold">300K</p>
                      </div>
                    </div>
                    <div className="col-span-4 space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <FaUserEdit size={20} />
                        attach Proof (Screenshots, Videos)
                      </p>
                      <div className="flex gap-4">
                        <div className="h-[200px] w-[200px] border border-dashed border-black bg-gray-100"></div>
                        <div className="h-[200px] w-[200px] border border-dashed border-black bg-gray-100"></div>
                        <div className="h-[200px] w-[200px] border border-dashed border-black bg-gray-100"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="border rounded-lg px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="value-1">
            <AccordionTrigger className="hover:no-underline cursor-pointer">
              <div className="flex items-center gap-4 ">
                <p className="text-xl">Submission 2</p>
                <Badge className="bg-light-green">Approved</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="space-y-2">
                  <p className="text-lg flex items-center gap-2">
                    <FaUserEdit size={20} />
                    Description / Update (Optional)
                  </p>
                  <div className="px-1">
                    <Textarea
                      placeholder="Description of the proof will be visible here"
                      disabled
                    />
                  </div>
                </div>
                <Card>
                  <CardContent className="grid grid-cols-6">
                    <div className="space-y-8 col-span-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <FaUserEdit size={20} />
                          platform 1
                        </p>
                        <p>facebook.com/hania/live</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <FaUserEdit size={20} />
                          Performance Metrics
                        </p>
                        <p className="text-xl font-semibold">300K</p>
                      </div>
                    </div>
                    <div className="col-span-4 space-y-2">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <FaUserEdit size={20} />
                        attach Proof (Screenshots, Videos)
                      </p>
                      <div className="flex gap-4">
                        <div className="h-[200px] w-[200px] border border-dashed border-black bg-gray-100"></div>
                        <div className="h-[200px] w-[200px] border border-dashed border-black bg-gray-100"></div>
                        <div className="h-[200px] w-[200px] border border-dashed border-black bg-gray-100"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SubmissionHistory;
