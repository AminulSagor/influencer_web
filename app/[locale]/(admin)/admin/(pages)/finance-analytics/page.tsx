import { ArrowLeft, ArrowLeftCircle } from "lucide-react";
import React from "react";
import RowOne from "./_components/row-one";
import RowTwo from "./_components/row-two";

const page = () => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-Primary">
        <ArrowLeftCircle />
        <p className="text-xl font-semibold">Finance and Analytics</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <RowOne />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <RowTwo />
        </div>
      </div>
    </div>
  );
};

export default page;
