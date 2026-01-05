"use client";
import {
  agencies,
  influencers,
} from "@/app/[locale]/(brand)/brand/(pages)/explore/data";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Music, Star, StarHalf } from "lucide-react";
import React, { JSX, useState } from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa6";

const ExplorePage = () => {
  const [type, setType] = useState<string>("influencer");

  // Platform icon mapping
  const getPlatformIcon = (platform: string) => {
    const iconSize = 18;

    const platformIcons: Record<string, JSX.Element> = {
      instagram: <FaInstagram size={iconSize} />,
      youtube: <FaYoutube size={iconSize} />,
      tiktok: <Music size={iconSize} />,
    };

    return platformIcons[platform];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div>
            <h1 className="text-Primary text-lg font-semibold">Explore</h1>
            <p className="text-dark-gray text-sm">
              Know your Influencers, Agencies and more{" "}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setType("influencer")}
              className={`cursor-pointer ${
                type === "influencer"
                  ? "bg-light-green rounded-full p-2 px-4 text-white"
                  : ""
              }`}
            >
              Influencer
            </button>
            <button
              onClick={() => setType("ad-agencies")}
              className={`cursor-pointer ${
                type === "ad-agencies"
                  ? "bg-light-green rounded-full p-2 px-4 text-white"
                  : ""
              }`}
            >
              Ad Agencies
            </button>
          </div>
        </div>
      </CardHeader>
      <div className="border border-light-gray w-full" />

      <CardContent>
        {type === "influencer" ? (
          <div className="space-y-4">
            {/* searching */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-[360px] max-w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search By Influencer Name"
                  className="h-10 rounded-lg pl-9 placeholder:text-sm"
                />
              </div>

              {/* Showing */}
              <div className="text-xs text-muted-foreground">
                Showing 24 of 200 Results
              </div>
            </div>

            {/* influencer */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-start mt-8">
              {influencers.map((influencer) => (
                <div
                  key={influencer.id}
                  className="bg-linear-to-b from-Primary/90 to-light-green rounded-md p-3 text-white/90 flex flex-col items-center relative"
                >
                  {/* Profile Image */}
                  <div className="bg-white w-18 h-18 shadow-md rounded-full" />

                  {/* Name */}
                  <h2 className="text-lg font-semibold text-center mt-2">
                    {influencer.name}
                  </h2>

                  {/* Platform Icons */}
                  <div className="flex gap-1.5 mt-3">
                    {influencer.socials.map((social, index) => (
                      <div key={index}>{getPlatformIcon(social.platform)}</div>
                    ))}
                  </div>

                  {/* type */}
                  <div className="flex text-xs mt-0.5">
                    {influencer.types?.map((v, index) => (
                      <span key={index}>{v} , </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="mt-4">
                    <RatingStars rating={influencer.rating} />
                  </div>
                </div>
              ))}
            </div>

            {/* pagination */}
            <div className="flex justify-end text-dark-gray text-sm mt-16">
              <div className="flex gap-9 items-center">
                <div className="flex gap-2 items-center">
                  <span>Page</span>
                  <span className="border h-8 flex items-center justify-center w-12  rounded-lg border-light-green bg-Secondary/70">
                    1
                  </span>
                  <span>of</span>
                  <span>5</span>
                </div>

                <PrimaryButton className="px-5">Next</PrimaryButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* searching */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-[360px] max-w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search By Brand Name"
                  className="h-10 rounded-lg pl-9"
                />
              </div>

              {/* Showing */}
              <div className="text-xs text-muted-foreground">
                Showing 24 of 200 Results
              </div>
            </div>

            {/* agencies grid - you'll need to add similar for agencies */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-start mt-8">
              {agencies.map((agency) => (
                <div
                  key={agency.id}
                  className="bg-linear-to-b from-Primary/90 to-light-green rounded-md p-3 text-white/90 flex flex-col items-center relative"
                >
                  {/* Profile Image */}
                  <div className="bg-white w-18 h-18 shadow-md rounded-full" />

                  {/* Name */}
                  <h2 className="text-lg font-semibold text-center mt-2">
                    {agency.name}
                  </h2>

                  <h2 className="text-sm">{agency.category}</h2>

                  {/* Rating */}
                  <div className="mt-6">
                    <RatingStars rating={agency.rating} />
                  </div>
                </div>
              ))}
            </div>

            {/* pagination */}
            <div className="flex justify-end text-dark-gray text-sm mt-16">
              <div className="flex gap-9 items-center">
                <div className="flex gap-2 items-center">
                  <span>Page</span>
                  <span className="border h-8 flex items-center justify-center w-12  rounded-lg border-light-green bg-Secondary/70">
                    1
                  </span>
                  <span>of</span>
                  <span>5</span>
                </div>

                <PrimaryButton className="px-5">Next</PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExplorePage;

// Rating component
const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(
        <StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-white/60" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};
