"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "./star-rating";

interface ClientRatingCardProps {
  name: string;
  avatarUrl?: string;
  rating: number;
  maxRating?: number;
}

const ClientRatingCard = ({
  name,
  avatarUrl,
  rating,
  maxRating = 5,
}: ClientRatingCardProps) => {
  return (
    <div className="border p-4 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <p>{name}</p>
        </div>
        <div className="flex items-center gap-2">
          <p>Rated By Client:</p>
          <StarRating rating={rating} max={maxRating} />
        </div>
      </div>
    </div>
  );
};

export default ClientRatingCard;
