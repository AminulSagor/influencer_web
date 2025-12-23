import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

const SupportCenterCard = () => {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-Primary">Support Center</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-light-green text-2xl">Need any assistance?</h2>
          <p className="text-orange">Call us or email us your query</p>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="md:col-span-6 col-span-12">
            <Card className="gap-2">
              <CardHeader>
                <CardTitle className="flex items-center text-xl gap-2 text-Primary">
                  <FaPhone />
                  Helpline Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1">
                  <h3 className="text-Primary">Help Line 1</h3>
                  <p className="text-sm text-orange">+8801234567890</p>
                  <p className="text-light-green text-xs">10AM-8PM</p>
                </div>
                <div className="p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1">
                  <h3 className="text-Primary">Help Line 1</h3>
                  <p className="text-sm text-orange">+8801234567890</p>
                  <p className="text-light-green text-xs">10AM-8PM</p>
                </div>
                <div className="p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1">
                  <h3 className="text-Primary">Help Line 1</h3>
                  <p className="text-sm text-orange">+8801234567890</p>
                  <p className="text-light-green text-xs">10AM-8PM</p>
                </div>
                <div className="p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1">
                  <h3 className="text-Primary">Help Line 1</h3>
                  <p className="text-sm text-orange">+8801234567890</p>
                  <p className="text-light-green text-xs">10AM-8PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-6 col-span-12">
            <Card className="gap-2">
              <CardHeader>
                <CardTitle className="flex items-center text-xl gap-2 text-Primary">
                  <MdEmail />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1">
                  <p className="text-sm text-orange">support1@brandguru.io</p>
                </div>
                <div className="p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1">
                  <p className="text-sm text-orange">support1@brandguru.io</p>
                </div>
                <div className="p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1">
                  <p className="text-sm text-orange">support1@brandguru.io</p>
                </div>
                <div className="p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1">
                  <p className="text-sm text-orange">support1@brandguru.io</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportCenterCard;
