import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import Image from "next/image";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaClock, FaFile, FaMoneyBillWave, FaUser } from "react-icons/fa6";
import { TfiMenuAlt } from "react-icons/tfi";
import ActionItem from "./action-item";
import { ACTION_ITEMS } from "./action-item-data";
import { ScrollArea } from "@/components/ui/scroll-area";

const ActionRequiredCard = () => {
  return (
    <Card className="p-0">
      <CardHeader className="pt-4 border-b bg-linear-to-br from-white to-Secondary [.border-b]:pb-4">
        <div className="space-y-6">
          <CardTitle className="flex items-center gap-2 text-Primary ">
            <TfiMenuAlt />
            Action Required
          </CardTitle>
          <div className="flex gap-2">
            <div className="flex border items-center gap-4 px-4 py-2 rounded-lg bg-white">
              <div className="rounded-lg flex items-center text-xs">All</div>
            </div>

            <div className="flex border items-center gap-4 px-4 py-2 rounded-lg bg-white">
              <div className="rounded-lg flex items-center text-xs">
                New Campaign Requests
              </div>

              {/* Badge */}
              <div className="top-1 right-2 bg-red-600 text-white text-xs font-semibold  py-0.5 rounded-full w-5 h-5 flex items-center justify-center">
                20
              </div>
            </div>
            <div className="flex border items-center gap-4 px-4 py-2 rounded-lg bg-white">
              <div className="rounded-lg flex items-center text-xs">
                Pending Verification
              </div>

              {/* Badge */}
              <div className="top-1 right-2 bg-red-600 text-white text-xs font-semibold  py-0.5 rounded-full w-5 h-5 flex items-center justify-center">
                12
              </div>
            </div>

            <div className="flex border items-center gap-4 px-4 py-2 rounded-lg bg-white">
              <div className="rounded-lg flex items-center text-xs">
                Milestone Reviews
              </div>

              {/* Badge */}
              <div className="top-1 right-2 bg-red-600 text-white text-xs font-semibold  py-0.5 rounded-full w-5 h-5 flex items-center justify-center">
                45
              </div>
            </div>

            <div className="flex border items-center gap-4 px-4 py-2 rounded-lg bg-white">
              <div className="rounded-lg flex items-center text-xs">
                Payout Requests
              </div>

              {/* Badge */}
              <div className="top-1 right-2 bg-red-600 text-white text-xs font-semibold  py-0.5 rounded-full w-5 h-5 flex items-center justify-center">
                58
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6 space-y-2">
        <ScrollArea className="h-[80vh] px-4 pb-6">
          <div className="space-y-2">
            {ACTION_ITEMS.map((item) => (
              <ActionItem
                key={item.id}
                type={item.type}
                title={item.title}
                description={item.description}
                user={item.user}
                time={item.time}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActionRequiredCard;
