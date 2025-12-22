import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { BsDownload } from "react-icons/bs";

const QuoteDetailsCard = () => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-Primary flex items-center gap-2">
          Quote Details
        </CardTitle>
        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-Secondary">
          <span className="text-light-green font-semibold">৳</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="px-4 py-2 rounded-lg border border-light-green bg-linear-to-r bg-Secondary to-white">
          <div className="space-y-1 mb-1">
            <div className="flex items-center justify-between ">
              <p className="text-sm">Base Campaign Budget</p>
              <p className="text-sm text-light-green">৳100000</p>
            </div>
            <div className="flex items-center justify-between ">
              <p className="text-sm">+ Vat/Tax(15%)</p>
              <p className="text-sm text-light-green">৳15000</p>
            </div>
          </div>
          <Separator className="bg-Primary/40" />
          <div className="flex items-center justify-between mb-2 mt-1">
            <p className="text-sm">Total Payable By Client</p>
            <p className="text-sm text-light-green">৳115000</p>
          </div>
          <Separator className="bg-Primary/40" />
          <div className="flex items-center justify-between mb-2 mt-1">
            <p className="text-sm">Your Profit(13%)</p>
            <p className="text-sm text-light-green">৳13000</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">-Platform Fee(2%)</p>
            <p className="text-sm text-light-green">-৳2000</p>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm">Your Actual Profit</p>
            <p className="text-sm text-light-green">৳11000</p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-lg border border-light-green bg-linear-to-r bg-Secondary to-white">
          <div className="space-y-1 mb-1">
            <div className="flex items-center justify-between ">
              <p className="text-sm">Total Campaign Spent</p>
              <p className="text-sm text-light-green">৳102000</p>
            </div>
            <div className="flex items-center justify-between ">
              <p className="text-xs font-semibold text-Primary">
                Campaign Spent in Dollar ( 122.37 BDT/$ )
              </p>
              <p className="text-xs text-light-green font-semibold">$833.57</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteDetailsCard;
