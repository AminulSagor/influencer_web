import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

const helplines = [
  { label: "Help Line 1", number: "+8801234567890", time: "10AM-8PM" },
  { label: "Help Line 2", number: "+8801234567890", time: "10AM-8PM" },
  { label: "Help Line 3", number: "+8801234567890", time: "10AM-8PM" },
  { label: "Help Line 4", number: "+8801234567890", time: "10AM-8PM" },
];

const emails = [
  "support1@brandguru.io",
  "support1@brandguru.io",
  "support1@brandguru.io",
  "support1@brandguru.io",
];

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
                {helplines.map((item, index) => (
                  <a
                    key={`${item.number}-${index}`}
                    href={`tel:${item.number}`}
                    className="block p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1 transition hover:shadow-sm"
                  >
                    <h3 className="text-Primary">{item.label}</h3>
                    <p className="text-sm text-orange">{item.number}</p>
                    <p className="text-light-green text-xs">{item.time}</p>
                  </a>
                ))}
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
                {emails.map((email, index) => (
                  <a
                    key={`${email}-${index}`}
                    href={`mailto:${email}`}
                    className="block p-2 border border-light-green rounded-lg bg-linear-to-r from-white to-Secondary space-y-1 transition hover:shadow-sm"
                  >
                    <p className="text-sm text-orange">{email}</p>
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportCenterCard;
