"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const RequestToRequote = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 rounded-full" variant={"outline"}>
          Request To Requote
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-Primary">Requote</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="space-y-2">
            <Label>Requote your change in percentage</Label>
            <Input className="border-light-green  focus-visible:border-ring focus-visible:ring-light-green/50 focus-visible:ring-2 py-6 text-center font-medium font-4xl text-Primary" />
          </div>
          <div className="space-y-2">
            <Label>Write Dollar Rate</Label>
            <Input className="border-light-green  focus-visible:border-ring focus-visible:ring-light-green/50 focus-visible:ring-2 py-6 text-center font-medium font-4xl text-Primary" />
          </div>
          <div className="space-y-2">
            <Label>New Requote Overview</Label>
            <div className="border border-light-green p-4 rounded-md bg-linear-to-r from-Secondary to-white space-y-1">
              <div className="flex justify-between items-center text-sm">
                <p>Total Payable By Client</p>
                <p className="text-light-green font-medium">৳115,000</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p>Your Profit</p>
                <p className="text-light-green font-medium">৳15,000</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p>platform Charge</p>
                <p className="text-light-green font-medium">-৳2,000</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p>Actual Profit</p>
                <p className="text-light-green font-medium">-৳13,000</p>
              </div>

              <div className="mt-4"></div>
              <div className="flex justify-between items-center text-sm">
                <p>Total Campaign spent</p>
                <p className="text-light-green font-medium">৳100,000</p>
              </div>

              <div className="flex justify-between items-center text-sm">
                <p className="text-Primary font-medium">
                  Campaign Spent in Dollar (122.37 BDT/$ )
                </p>
                <p className="text-light-green font-medium">$818.48</p>
              </div>
            </div>
          </div>
          <div>
            <Button className="w-full bg-light-green hover:bg-light-green/90">
              Requote to client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestToRequote;
