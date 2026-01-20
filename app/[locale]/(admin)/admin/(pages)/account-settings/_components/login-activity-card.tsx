import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { FaWindows } from "react-icons/fa";
import LoginHistoryCard from "./login-history";

const LoginActivityCard = () => {
  return (
    <Card>
      <div className="px-4">
        <div className="p-4 rounded-md border border-light-green bg-green-50">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Button className="border-light-green" variant={"outline"}>
                <FaWindows />
              </Button>
              <div>
                <p className="text-xl font-medium mb-1">
                  You are currently logged in on this device
                </p>
                <div>
                  <p>Windows 10 PC - Chrome Browser</p>
                  <p className="text-sm text-light-green">Dhaka, Bangladesh</p>
                  <p className="text-xs mt-1 text-gray-400">103.25.12.xx</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 aspect-square rounded-full bg-light-green"></div>
              <p className="text-light-green text-sm">Online Now</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <LoginHistoryCard />
      </div>
    </Card>
  );
};

export default LoginActivityCard;
