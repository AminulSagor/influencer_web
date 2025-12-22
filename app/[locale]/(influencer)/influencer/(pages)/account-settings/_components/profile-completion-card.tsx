import { CheckCircle, Pencil } from "lucide-react";

export default function ProfileCompletionCard() {
  return (
    <div className="rounded-2xl border bg-white p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-[#2D5016]" />
        <h3 className="text-lg font-semibold text-[#2D5016]">
          Profile Completion
        </h3>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-[#E6ECD9] mb-6">
        <div className="h-full w-[60%] rounded-full bg-[#5A7D3B]" />
      </div>

      {/* Bio */}
      <div className="rounded-xl border p-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-[#2D5016]">Bio</p>
          <Pencil className="w-4 h-4 text-[#6B7A4C] cursor-pointer" />
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          The Authority In Fashion & Lifestyle Marketing. With Deep Industry
          Connections And A Passion For Aesthetics, We Place Your Brand At The
          Center.
        </p>
      </div>
    </div>
  );
}
