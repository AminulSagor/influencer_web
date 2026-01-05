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

const ProfileEditCard = () => {
  return (
    <Card className="py-0 relative">
      <CardContent className="py-4 px-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            {/* Header */}
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-28">
                <h1 className="font-semibold text-base text-Primary">Profile</h1>
              </div>
            </AccordionTrigger>

            {/* Edit button */}
            <Button
              type="button"
              className="rounded-full text-xs px-8 bg-light-green text-white hover:bg-light-green/90 absolute top-4 right-14 h-7"
            >
              Edit Profile
            </Button>

            <AccordionContent className="pb-6 pt-4">
              <div className="space-y-7">
                {/* Top section */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                  <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                    {/* Avatar upload */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-28 h-28 rounded-full border border-dashed border-light-green/60 bg-light-green/15 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-Primary/70" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-7 px-10 rounded-full text-xs border-light-green/40 text-Primary hover:bg-light-green/10"
                        >
                          Remove
                        </Button>
                        <Button
                          type="button"
                          className="h-7 px-10 rounded-full text-xs bg-light-green text-white hover:bg-light-green/90"
                        >
                          Upload Photo
                        </Button>
                      </div>
                    </div>

                    {/* Name + info */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-Primary">
                        Hania Amir
                      </h3>
                      <p className="text-sm text-Primary/60">Influencer</p>

                      <div className="mt-4 space-y-3 text-sm">
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
                            haniaamir@email.com
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="h-9 w-9 rounded-full bg-light-green/15 grid place-items-center">
                            <Phone className="w-4 h-4 text-light-green" />
                          </span>
                          <p className="text-Primary/70 text-sm">
                            +8801234567890
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="mt-10 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="First Name *">
                      <Input
                        placeholder="Enter First Name"
                        className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                      />
                    </Field>

                    <Field label="Email Address *">
                      <Input
                        defaultValue="grow_big@gmail.com"
                        disabled
                        className="h-10 border-light-green/20 bg-light-green/10 text-Primary/60"
                      />
                    </Field>

                    <Field label="Last Name *">
                      <Input
                        placeholder="Enter Last Name"
                        className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30"
                      />
                    </Field>

                    <Field label="Phone Number *">
                      <Input
                        defaultValue="+8801234567890"
                        disabled
                        className="h-10 border-light-green/20 bg-light-green/10 text-Primary/60"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProfileEditCard;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-light-green">{label}</p>
      {children}
    </div>
  );
}
