
const UnverifiedShell = () => {
 return (
    <div className="space-y-6 animate-pulse">
      <div className="h-[104px] rounded-2xl bg-[#6E944B]" />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-6 w-44 rounded-full bg-[#E5E7EB]" />
            <div className="h-6 w-6 rounded-full bg-[#E5E7EB]" />
          </div>

          <div className="mb-8 h-2 w-full rounded-full bg-[#E5E7EB]" />

          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[#E5E7EB]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded-full bg-[#E5E7EB]" />
                  <div className="h-3 w-48 rounded-full bg-[#F1F5F9]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-6 w-44 rounded-full bg-[#E5E7EB]" />
            <div className="h-6 w-6 rounded-full bg-[#E5E7EB]" />
          </div>

          <div className="mb-8 h-2 w-full rounded-full bg-[#E5E7EB]" />

          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[#E5E7EB]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 rounded-full bg-[#E5E7EB]" />
                  <div className="h-3 w-20 rounded-full bg-[#F1F5F9]" />
                </div>
                <div className="h-6 w-6 rounded-full bg-[#E5E7EB]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-6 h-6 w-28 rounded-full bg-[#E5E7EB]" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-14 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]" />
          <div className="h-14 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]" />
        </div>
      </div>
    </div>
  );
}

export default UnverifiedShell




