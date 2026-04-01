// app/dashboard/_components/dashboard-shell.tsx
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function DashboardShell() {
  return (
    <div className="pb-20">
      {/* Stats Cards Shell */}
      <div className="pt-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="bg-linear-to-r from-[#405E2C]/90 to-[#7A9B57] rounded-lg p-5 space-y-8 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-white/30 rounded animate-pulse" />
                <div className="h-7 w-7 bg-white/30 rounded animate-pulse" />
              </div>

              <div className="flex items-center justify-between">
                <div className="h-8 w-16 bg-white/30 rounded animate-pulse" />
                <div className="h-5 w-20 bg-white/30 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Shell */}
      <div className="space-y-4 px-4 pt-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          {/* Work In Progress Card Shell */}
          <div className="space-y-4 lg:col-span-4">
            <Card>
              <CardHeader>
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              </CardHeader>

              <CardContent className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="rounded-[24px] border border-[#D9D9D9] px-7 py-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                        <div className="mt-1 h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                        <div className="mt-3 h-6 w-24 bg-gray-200 rounded animate-pulse" />

                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>

                      <div className="h-10 w-16 bg-gray-200 rounded-[14px] animate-pulse" />
                    </div>

                    <div className="mt-4">
                      <div className="h-3 w-full bg-gray-200 rounded-full animate-pulse" />
                      <div className="mt-2 flex items-center justify-between">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="justify-center pt-2">
                <div className="w-full max-w-[420px] h-11 bg-gray-200 rounded-md animate-pulse" />
              </CardFooter>
            </Card>
          </div>

          {/* Right Column Shell */}
          <div className="space-y-4 lg:col-span-2">
            {/* Action Required Card Shell */}
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              </CardHeader>

              <CardContent className="space-y-3">
                {[1, 2].map((index) => (
                  <div
                    key={index}
                    className="bg-[#FFF4EE] rounded-lg p-4 flex flex-row lg:flex-col xl:flex-row justify-between items-center lg:items-start xl:items-center gap-2"
                  >
                    <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />

                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                        <div className="mt-1 h-4 w-full bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>

                    <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                ))}

                <div className="flex justify-center gap-2 pt-2">
                  {[1, 2].map((index) => (
                    <div
                      key={index}
                      className="h-2.5 w-2.5 bg-gray-200 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadline Card Shell */}
            <Card>
              <CardHeader className="pb-4">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="flex overflow-hidden rounded-r-xl"
                    >
                      <div className="w-[15px] shrink-0 bg-gray-200 animate-pulse" />

                      <div className="flex min-h-[70px] w-full items-center gap-4 bg-[#F6F6F6] px-4 py-3">
                        <div className="w-[54px] shrink-0 text-center space-y-1">
                          <div className="h-4 w-10 bg-gray-200 rounded animate-pulse mx-auto" />
                          <div className="h-5 w-8 bg-gray-200 rounded animate-pulse mx-auto" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                        </div>

                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-2 pt-5">
                  {[1, 2].map((index) => (
                    <div
                      key={index}
                      className="h-2.5 w-2.5 bg-gray-200 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Lifetime Summary Shell */}
      <div className="pt-6 px-4">
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          </CardHeader>

          <CardContent className="grid gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="space-y-2 rounded-lg border bg-secondary px-4 py-2"
              >
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div>
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="mt-1 h-4 w-28 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
