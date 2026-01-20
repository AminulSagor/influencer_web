import React from "react";
import { FaEye, FaPlay, FaHeart, FaComment } from "react-icons/fa";

interface MilestoneTargetProps {
  reach: number | string;
  views: number | string;
  reaction: number | string;
  comment: number | string;
}

const MilestoneTarget = ({
  reach,
  views,
  reaction,
  comment,
}: MilestoneTargetProps) => {
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="border border-Primary p-2 rounded-lg col-span-6 space-y-1">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Reach</h2>
          <FaEye />
        </div>
        <div className="text-2xl font-semibold">{reach}</div>
      </div>
      <div className="border border-Primary p-2 rounded-lg col-span-6 space-y-1">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Views</h2>
          <FaPlay />
        </div>
        <div className="text-2xl font-semibold">{views}</div>
      </div>
      <div className="border border-Primary p-2 rounded-lg col-span-6 space-y-1">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Reaction</h2>
          <FaHeart />
        </div>
        <div className="text-2xl font-semibold">{reaction}</div>
      </div>
      <div className="border border-Primary p-2 rounded-lg col-span-6 space-y-1">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Comment</h2>
          <FaComment />
        </div>
        <div className="text-2xl font-semibold">{comment}</div>
      </div>
    </div>
  );
};

export default MilestoneTarget;
