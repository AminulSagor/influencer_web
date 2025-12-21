"use client";

import React from "react";
import { Phone, Mail } from "lucide-react";

type HelpLine = {
  label: string;
  phone: string;
  hours: string;
};

const helpLines: HelpLine[] = [
  { label: "Help Line 1", phone: "+8801234567890", hours: "10AM–8PM" },
  { label: "Help Line 2", phone: "+8801234567890", hours: "10AM–8PM" },
  { label: "Help Line 3", phone: "+8801234567890", hours: "10AM–8PM" },
  { label: "Help Line 4", phone: "+8801234567890", hours: "10AM–8PM" },
];

const emails = [
  "support1@brandguru.io",
  "support2@brandguru.io",
  "support3@brandguru.io",
  "support4@brandguru.io",
];

const SupportCenter = () => {
  return (
    <section className="w-full">
      <div className="w-full rounded-2xl border border-[#E6E7EA] bg-white shadow-sm overflow-hidden">
        {/* Top title bar */}
        <div className="px-6 py-4 border-b border-[#ECEDEF]">
          <p className="text-sm font-semibold text-[#617C50]">Support Center</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 md:px-8 md:py-7">
          <h1 className="text-2xl md:text-3xl  font-semibold tracking-tight text-[#7A9B57]">
            Need any assistance?
          </h1>
          <p className="mt-1 text-base md:text-lg font-medium text-[#D79552]">
            Call us or email us your query
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Helpline Numbers */}
            <div className="rounded-xl border border-[#E4E7DD] bg-white">
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-[#617C50]" />
                  <h2 className="text-lg font-semibold text-[#617C50]">
                    Helpline Numbers
                  </h2>
                </div>
              </div>

              <div className="px-5 pb-5 space-y-3">
                {helpLines.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-[#D8E3C4] bg-[#F7FBF2] px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-[#617C50]">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-[#D79552]">
                      {item.phone}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8E9A8A]">
                      {item.hours}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Us */}
            <div className="rounded-xl border border-[#E4E7DD] bg-white">
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#617C50]" />
                  <h2 className="text-lg font-semibold text-[#617C50]">
                    Email Us
                  </h2>
                </div>
              </div>

              <div className="px-5 pb-5 space-y-3">
                {emails.map((email) => (
                  <div
                    key={email}
                    className="rounded-lg border border-[#D8E3C4] bg-[#F7FBF2] px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-[#D79552]">
                      {email}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportCenter;
