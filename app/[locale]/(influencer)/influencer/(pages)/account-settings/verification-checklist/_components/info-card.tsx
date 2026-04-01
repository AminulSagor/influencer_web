"use client";

import { Music, AlertCircle } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import { useLogout } from "@/hooks/useLogout";

export default function InfoCard({status} : {status : boolean}) {
  const { logout, loading: logoutLoading } = useLogout();

  return (
    <div className="rounded-2xl bg-linear-to-r from-Primary to-light-green text-white flex sm:items-center sm:justify-center p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between xl:px-4 w-full xl:max-w-xl px-3 md:px-4 overflow-y-scroll no-scrollbar">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-4 w-full">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-white/70 overflow-hidden">
            {/* service image later */}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold leading-none">Hania Amir</h3>
              <span className="w-4 h-4 rounded-full bg-white/90 text-[#5E7F3A] text-[10px] flex items-center justify-center">
                <AlertCircle className="w-3 h-3" />
              </span>
            </div>

            <p className="text-sm text-[#DDE8C6]">Dhaka, Bangladesh</p>

            <span className="inline-block mt-1 px-3 py-0.5 text-xs rounded-md bg-[#F1F6DE] text-[#2D5016]">
              {
                status ? 'Verified'  : 'Unverified'
              }
            </span>
          </div>
        </div>

        {/* Right: Socials + Logout */}
        <div className="flex flex-col gap-4 w-full pl-3 sm:pl-0">
          {/* Social handles */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>
                <FaInstagram size={26}/>
              </span>
              <span>@haniaa_amir</span>
            </div>

            <div className="flex items-center gap-2">
              <span>
                <FaYoutube size={26}/>
              </span>
              <span>hania</span>
            </div>

            <div className="flex items-center gap-2">
              <span>
                <Music size={26}/>
              </span>
              <span>@its_haniaa</span>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={logout}
            disabled={logoutLoading}
            className="px-6 py-1.5 rounded-lg bg-[#F1F6DE] text-[#2D5016] text-sm font-medium hover:opacity-90 gap-2 sm:max-w-44 disabled:opacity-50"
          >
            {logoutLoading ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
