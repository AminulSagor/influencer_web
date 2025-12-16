"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";

type User = {
  title: string;
  role: string;
};

const SignUpStepOne = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const users: User[] = [
    {
      title: "Brand",
      role: "Promote My Business",
    },
    {
      title: "Influencer",
      role: "Monetize My Reach",
    },
    {
      title: "Ad Agency",
      role: "Manage Client Campaigns",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
      <div className="">
        <h1 className="text-Primary text-[52px] font-semibold">Sign Up</h1>
        <p className="text-[18px] text-light-green border-Primary p-">
          Select your account type
        </p>

        <div className="gap-3">
          {users.map((user) => (
            <div
              key={user.title}
              onClick={() => setSelected(user.title)}
              className={`mt-3 border rounded-xl p-4 cursor-pointer h-31.5 sm:w-78.5
                flex justify-between items-center
                ${
                  selected === user.title
                    ? "bg-Secondary border-Primary"
                    : "bg-off-white"
                }
              `}
            >
              {/* Left content */}
              <div className="text-Primary">
                <h1 className="font-semibold text-[26px]">{user.title}</h1>
                <p>{user.role}</p>
              </div>

              {/* Right tick */}
              {selected === user.title && (
                <FaCheck className="text-Primary text-xl" />
              )}
            </div>
          ))}
        </div>

        <Button className="text-white bg-light-green h-16 w-full sm:w-78.5 text-[18px] mt-10">
          Continue
        </Button>
        <p className="text-light-gray text-sm mt-5 text-center">
          Already have an account? <span className="text-black">Login</span>
        </p>
      </div>

      <div className="hidden md:block border border-light-green rounded-lg p-2">
        <Image
          src={"/auth-images/step-1-brand-image.png"}
          height={428}
          width={428}
          alt="brand-image"
        />
        <div className="text-Primary text-[30px] font-semibold flex flex-col items-center justify-center">
          <h1>Connect with Top </h1>
          <h1>Talent & Brands</h1>
        </div>
        <p className="text-Primary mt-6 text-[15px] text-center">
          The ultimate marketplace connecting visionary brands with verified
          influencers and agencies.
        </p>
      </div>
    </div>
  );
};

export default SignUpStepOne;
