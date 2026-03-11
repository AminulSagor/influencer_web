"use client";

import CollapsibleCard from "./collapsible-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type CardStatus = "Pending" | "Rejected" | "Accepted";

interface Props {
  title: string;
  numberLabel: string;
  numberValue: string;
  imageUrl?: string;
  status?: CardStatus;
}

const DocumentCard = ({
  title,
  numberLabel,
  numberValue,
  imageUrl,
  status = "Pending",
}: Props) => {
  return (
    <CollapsibleCard heading={title}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">{numberLabel}</p>
            <p className="text-lg font-semibold text-light-green">
              {numberValue || "N/A"}
            </p>
          </div>

          <Badge className="bg-orange text-white hover:bg-orange">
            Notify
          </Badge>
        </div>

        <div className="relative h-[120px] w-full overflow-hidden rounded-md border border-dashed bg-gray-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              {title}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" className="min-w-[92px]">
            Reject
          </Button>
          <Button variant="lightGreen" size="sm" className="min-w-[92px]">
            Approve
          </Button>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default DocumentCard;