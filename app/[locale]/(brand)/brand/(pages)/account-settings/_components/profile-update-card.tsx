"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Upload } from "lucide-react";

const ProfileUpdateCard = () => {
  return (
    <Card className="py-0 relative bg-white">
      <CardContent className="py-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            {/* Header */}

            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-28">
                <h1 className="font-semibold text-base text-Primary">
                  Profile
                </h1>
              </div>
            </AccordionTrigger>

            <Button
              type="button"
              className="rounded-full text-xs px-8 bg-light-green text-white hover:bg-light-green/90 absolute top-4 right-14 h-7"
            >
              Edit Profile
            </Button>

            <AccordionContent className="pb-6 pt-4">
              {/* Top section: avatar + brand info */}
              <div className="flex gap-8">
                {/* Left: Avatar */}
                <div className="flex flex-col items-center gap-3 min-w-[180px]">
                  <div className="h-36 w-36 rounded-full bg-light-green/15 border border-dashed border-light-green/60 grid place-items-center">
                    <div className="h-10 w-10 rounded-full bg-light-green/20 grid place-items-center">
                      <Upload className="w-5 h-5 text-Primary/70" />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-7 px-8 rounded-full text-xs border-light-green/40 text-Primary hover:bg-light-green/10"
                  >
                    Remove
                  </Button>

                  <Button
                    type="button"
                    className="h-7 px-8 rounded-full text-xs bg-light-green text-white hover:bg-light-green/90"
                  >
                    Upload Photo
                  </Button>
                </div>

                {/* Right: Info */}
                <div className="flex-1">
                  <div className="space-y-1">
                    <h2 className="text-Primary text-2xl font-semibold">
                      Style Co.
                    </h2>
                    <p className="text-Primary font-medium leading-none">
                      Salman Khan
                    </p>
                    <p className="text-Primary/60 text-xs leading-none">
                      Brand Manager
                    </p>
                  </div>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="h-9 w-9 rounded-full bg-light-green/15 grid place-items-center">
                        <MapPin className="w-4 h-4 text-light-green" />
                      </span>
                      <div>
                        <p className="text-light-green font-medium">
                          Bangladesh
                        </p>
                        <p className="text-Primary/50 text-xs">
                          Swarupkathi, Dhaka
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-full bg-light-green/15 grid place-items-center">
                        <Mail className="w-4 h-4 text-light-green" />
                      </span>
                      <p className="text-Primary/70 text-sm">
                        salmanKhan@email.com
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-full bg-light-green/15 grid place-items-center">
                        <Phone className="w-4 h-4 text-light-green" />
                      </span>
                      <p className="text-Primary/70 text-sm">+8801234567890</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="mt-10 space-y-6">
                {/* row 1 */}
                <div className="grid md:grid-cols-3 gap-8">
                  <Field label="First Name" required>
                    <Input
                      placeholder="Enter First Name"
                      className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                    />
                  </Field>

                  <Field label="Email Address" required>
                    <Input
                      defaultValue="grow_big@gmail.com"
                      className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                    />
                  </Field>

                  <Field label="Thana" required>
                    <Input
                      defaultValue="Dhaka"
                      className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                    />
                  </Field>
                </div>

                {/* row 2 */}
                <div className="grid md:grid-cols-3 gap-8">
                  <Field label="Last Name" required>
                    <Input
                      placeholder="Enter Last Name"
                      className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                    />
                  </Field>

                  <Field label="Phone Number" required>
                    <Input
                      defaultValue="+8801234567890"
                      className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                    />
                  </Field>

                  <Field label="Zilla" required>
                    <Input
                      defaultValue="Dhaka"
                      className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                    />
                  </Field>
                </div>

                {/* full address */}
                <Field label="Full Address" required>
                  <textarea
                    placeholder="Enter Full Address"
                    className="w-full min-h-[110px] rounded-md border border-light-green/25 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-light-green/30"
                  />
                </Field>

                {/* row 3 */}
                <div className="grid md:grid-cols-3 gap-8">
                  <Field label="NID Number" required>
                    <Input
                      defaultValue="123123123123123"
                      className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                    />
                  </Field>

                  <Field label="BIN Number" required>
                    <Input
                      defaultValue="12312312312312"
                      className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                    />
                  </Field>

                  <Field label="Secondary Phone Number (Optional)">
                    <Input
                      defaultValue="+8801234567890"
                      className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                    />
                  </Field>
                </div>

                {/* website */}
                <Field label="Website">
                  <Input
                    placeholder="Enter Website Name"
                    className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                  />
                </Field>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProfileUpdateCard;

/** Small helper to match SS label style */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-light-green">
        {label} {required ? "*" : ""}
      </p>
      {children}
    </div>
  );
}
