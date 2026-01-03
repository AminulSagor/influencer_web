"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { useFormStore } from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";

type Agency = {
  id: string;
  name: string;
  subtitle: string;
};

const dummyAgencies: Agency[] = [
  { id: "a1", name: "Trendy Ad", subtitle: "Boosting Page" },
  { id: "a2", name: "BoostLab", subtitle: "Meta Ads Expert" },
  { id: "a3", name: "GrowthWing", subtitle: "Performance Agency" },
  { id: "a4", name: "ClickCraft", subtitle: "Creative + Ads" },
  { id: "a5", name: "AdNova", subtitle: "Brand Growth" },
  { id: "a6", name: "MediaHive", subtitle: "Campaign Specialist" },
  { id: "a7", name: "Trendy Ad", subtitle: "Boosting Page" },
  { id: "a8", name: "BoostLab", subtitle: "Meta Ads Expert" },
  { id: "a9", name: "GrowthWing", subtitle: "Performance Agency" },
  { id: "a10", name: "ClickCraft", subtitle: "Creative + Ads" },
  { id: "a11", name: "AdNova", subtitle: "Brand Growth" },
  { id: "a12", name: "MediaHive", subtitle: "Campaign Specialist" },
];

export default function Step2() {
  const { increaseStep, decreaseStep } = useCampaignStore();
  const { stepTwo, setStepTwo } = useFormStore();

  console.log(stepTwo);
  return (
    <Card className="border-none">
      <CardContent className="p-4 space-y-5">
        <div>
          <h1 className="text-Primary font-semibold pb-2">Campaign Niche</h1>

          <Select
            value={stepTwo.nicheType}
            onValueChange={(value) => setStepTwo({ nicheType: value })}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select Niche type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="real-estate">Real Estate Marketing</SelectItem>
              <SelectItem value="ecommerce">E-commerce Brands</SelectItem>
              <SelectItem value="fitness">Fitness & Gyms</SelectItem>
              <SelectItem value="restaurants">Restaurants & Cafes</SelectItem>
              <SelectItem value="doctors">Doctors & Clinics</SelectItem>
              <SelectItem value="salons">Beauty Salons & Spas</SelectItem>
              <SelectItem value="education">Education / Coaching</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h1 className="text-Primary font-semibold">
            Recommended Ad Agencies
          </h1>

          {/* horizontal scroll */}
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {dummyAgencies.map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-Primary font-semibold">Other Add Agencies</h1>
          <div className="max-h-72 overflow-x-auto flex flex-col gap-3 mt-3">
            {dummyAgencies.map((a) => (
              <AgencyCard2 key={a.id} agency={a} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <div className="flex gap-4">
            <SecondaryButton onClick={() => decreaseStep()}>
              Previous
            </SecondaryButton>

            <PrimaryButton className="px-8" onClick={() => increaseStep()}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AgencyCard({ agency }: { agency: Agency }) {
  return (
    <Card
      className={clsx(
        "border-none rounded-2xl overflow-hidden shrink-0",
        "w-[210px] ",
        "bg-linear-to-r from-Primary to-light-green"
      )}
    >
      <CardContent className="h-full flex flex-col items-center justify-center">
        <div className="h-18 w-18 rounded-full bg-linear-to-br from-white/70 to-light-green/40 shadow-inner" />

        <div className="mt-4 text-center">
          <p className="text-white font-semibold text-lg leading-tight">
            {agency.name}
          </p>
          <p className="text-white/80 text-sm">{agency.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AgencyCard2({ agency }: { agency: Agency }) {
  return (
    <Card
      className={clsx(
        "border-none rounded-2xl overflow-hidden shrink-0",
        "w-full",
        "bg-linear-to-r from-Primary to-light-green"
      )}
    >
      <CardContent className="flex items-center gap-4">
        <div className="h-15 w-15 rounded-full bg-linear-to-br from-white/70 to-light-green/40 shadow-inner" />

        <div className="text-center ">
          <p className="text-white font-semibold text-lg leading-tight">
            {agency.name}
          </p>
          <p className="text-white/80 text-sm">{agency.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}
