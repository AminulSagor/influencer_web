"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { blockUnblockUser } from "@/service/admin/users/block-unblock-user";

interface Props {
  userId: string;
}

const BlockedBanner = ({ userId }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUnblock = async () => {
    try {
      setLoading(true);
      await blockUnblockUser(userId);
      router.refresh();
    } catch (error) {
      console.error("Failed to unblock user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-700 rounded-xl px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <XCircle className="text-white fill-white stroke-red-700" size={28} />
        <span className="text-white font-semibold text-sm">
          This Profile Is Blocked
        </span>
      </div>

      <button
        onClick={handleUnblock}
        disabled={loading}
        className="bg-white hover:bg-gray-100 text-red-700 font-semibold px-6 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Unblocking..." : "Unblock"}
      </button>
    </div>
  );
};

export default BlockedBanner;
