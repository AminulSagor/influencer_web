"use client";

import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";
import { MapPin, Mail, Phone, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProfileEditCard() {
  const t = useTranslations("influencer.account-setting");

  return (
    <div>
      <CollapseCard title="Profile">
        <div className="space-y-7">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 rounded-full border border-dashed border-[#9DB47B] bg-[#F7FAEC] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#6B7A4C]" />
                </div>

                <div className="flex flex-col gap-2">
                  <button className="px-4 py-1.5 rounded-lg border text-sm">
                    {t("Remove")}
                  </button>
                  <button className="px-4 py-1.5 rounded-lg bg-[#6E8F4A] text-white text-sm">
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* Name + info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#2D5016]">
                  Hania Amir
                </h3>
                <p className="text-sm text-[#6B7A4C]">Influencer</p>

                <div className="space-y-1 text-sm text-[#6B7A4C]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <div>
                      <p>Bangladesh</p>
                      <p className="text-xs text-gray-400">
                        Swarupkathi, Dhaka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>haniaamir@email.com</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+8801234567890</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit + collapse */}
            <button className="px-5 py-2 rounded-full bg-[#6E8F4A] text-white text-sm">
              Edit Profile
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm text-[#6B7A4C] mb-1">
                {t("First Name *")}
              </label>
              <input
                placeholder="Enter First Name"
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6E8F4A]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-[#6B7A4C] mb-1">
                {t("Email Address *")}
              </label>
              <input
                value="grow_big@gmail.com"
                disabled
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm text-[#6B7A4C] mb-1">
                {t("Last Name *")}
              </label>
              <input
                placeholder="Enter Last Name"
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6E8F4A]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-[#6B7A4C] mb-1">
                {t("Phone Number *")}
              </label>
              <input
                value="+8801234567890"
                disabled
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </div>
      </CollapseCard>
    </div>
  );
}
