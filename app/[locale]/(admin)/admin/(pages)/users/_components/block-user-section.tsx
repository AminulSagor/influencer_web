"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { blockUnblockUser } from "@/service/admin/users/block-unblock-user";

interface Props {
  userId: string;
}

const BlockUserSection = ({ userId }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBlock = async () => {
    try {
      setLoading(true);
      await blockUnblockUser(userId);
      router.refresh();
    } catch (error) {
      console.error("Failed to block user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-red-500 rounded-xl p-5 bg-red-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XCircle className="text-red-600 fill-red-600 stroke-white" size={36} />
          <div>
            <h3 className="text-red-600 font-semibold text-base">
              Danger Zone
            </h3>
            <p className="text-red-600/70 text-sm">Block This Profile</p>
          </div>
        </div>

        <button
          onClick={handleBlock}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Blocking..." : "Block"}
        </button>
      </div>
    </div>
  );
};

export default BlockUserSection;
