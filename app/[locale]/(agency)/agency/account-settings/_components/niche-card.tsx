"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

const NicheCard = () => {
  const [niches, setNiches] = useState<string[]>([
    "Lifestyle",
    "Skincare",
    "Vlogging",
  ]);

  const [open, setOpen] = useState(false);
  const [newNiche, setNewNiche] = useState("");

  const handleAddNiche = () => {
    if (!newNiche.trim()) return;

    setNiches((prev) => [...prev, newNiche.trim()]);
    setNewNiche("");
    setOpen(false);
  };

  return (
    <>
      <Card>
        <div className="px-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-md p-0 hover:no-underline mb-4 text-Primary font-semibold">
                <p className="flex items-center gap-2">
                  Niche <BiSolidEdit size={20} />
                </p>
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {niches.map((niche, index) => (
                      <Badge
                        key={index}
                        className="bg-Secondary text-Primary px-4 py-1 flex items-center gap-2"
                      >
                        <FaCheckCircle />
                        {niche}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    onClick={() => setOpen(true)}
                    className="bg-transparent border border-dashed border-light-green text-light-green hover:bg-light-green hover:text-white w-full"
                    size="sm"
                  >
                    + Add another Niche
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Niche</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter niche name"
            value={newNiche}
            onChange={(e) => setNewNiche(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNiche}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NicheCard;
