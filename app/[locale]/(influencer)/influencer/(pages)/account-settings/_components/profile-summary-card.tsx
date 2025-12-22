
export default function ProfileSummaryCard() {
  return (
    <div className="rounded-2xl bg-linear-to-r from-[#5E7F3A] to-[#7FA35A] text-white flex items-center justify-center p-4">
      <div className="flex items-center justify-between xl:px-4 w-full xl:max-w-xl px-3 md:px-4">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-4">

          <div className="w-20 h-20 rounded-full bg-white border-2 border-white/70 overflow-hidden">
            {/* API image later */}
            {/* <Image src={avatarUrl} alt="avatar" fill /> */}
          </div>
        
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold leading-none">
                Hania Amir
              </h3>
              <span className="w-4 h-4 rounded-full bg-white/90 text-[#5E7F3A] text-[10px] flex items-center justify-center font-bold">
                ?
              </span>
            </div>

            <p className="text-sm text-[#DDE8C6]">
              Dhaka, Bangladesh
            </p>

            <span className="inline-block mt-1 px-3 py-[2px] text-xs rounded-md bg-[#F1F6DE] text-[#2D5016]">
              Unverified
            </span>
          </div>
        </div>
      

        {/* Right: Socials + Logout */}
        <div className="flex flex-col items-end gap-4">
          {/* Social handles */}
          <div className="space-y-2 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center">
                📸
              </span>
              <span>@haniaa_amir</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center">
                ▶️
              </span>
              <span>hania</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center">
                🎵
              </span>
              <span>@its_haniaa</span>
            </div>
          </div>

          {/* Logout */}
          <button className="px-6 py-1.5 rounded-lg bg-[#F1F6DE] text-[#2D5016] text-sm font-medium hover:opacity-90">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
