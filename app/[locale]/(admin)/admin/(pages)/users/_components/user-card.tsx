"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/** Influencer shape (already in your project) */
export type InfluencerRow = {
  userId: string;
  name: string;
  avatar: string | null;
  niches: string[];
  skills: string[];
  rating: number;
  platforms: string[];
  status: string;
  isVerified: boolean;
};

/** Client/Agency shape (matches your backend response you pasted) */
export type ClientRow = {
  id: string;
  userId: string;
  brandName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImg?: string | null;
  email?: string | null;
  phone?: string | null;
  zilla?: string | null;
  country?: string | null;
  isOnboardingComplete?: boolean;
  nidVerification?: { nidStatus?: string | null } | null;
};

type Variant = "influencer" | "client"; // (your API returns role=client for agency route too)

type Props =
  | { variant: "influencer"; users: InfluencerRow[] }
  | { variant: "client"; users: ClientRow[] };

function StatusPill({ status }: { status: string }) {
  const s = String(status ?? "").toLowerCase();
  const isApproved = s === "approved" || s === "verified";
  const isPending = s === "pending" || s === "unverified";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        isApproved
          ? "bg-light-green/15 text-light-green"
          : isPending
          ? "bg-orange/15 text-orange"
          : "bg-red/15 text-red"
      )}
    >
      {status}
    </span>
  );
}

export default function UserCard(props: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const title = useMemo(() => {
    const last = pathname?.split("/").filter(Boolean).pop() ?? "";
    return last ? last.replace(/-/g, " ") : "Users";
  }, [pathname]);

  function goDetails(userId: string) {
    // your influencer details route is /users/(routes)/influencer/[id]
    // for clients you likely have a similar route; if not, keep console log for now
    if (props.variant === "influencer") {
      router.push(`${pathname}/influencer/${userId}`);
      return;
    }
    router.push(`${pathname}/agency/${userId}`);
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-Primary/10">
        <h2 className="text-lg font-semibold text-black capitalize">{title}</h2>
      </div>

      <div className="p-4">
        <div className="rounded-md border border-Primary/10 overflow-hidden">
          <Table>
            <TableHeader>
              {props.variant === "influencer" ? (
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Niches</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Platforms</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              ) : (
                <TableRow>
                  <TableHead>Brand / Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              )}
            </TableHeader>

            <TableBody>
              {props.users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-light-gray py-8">
                    No data found.
                  </TableCell>
                </TableRow>
              ) : props.variant === "influencer" ? (
                props.users.map((u) => (
                  <TableRow key={u.userId}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-sm text-light-gray">
                      {(u.niches ?? []).slice(0, 2).join(", ")}
                      {(u.niches ?? []).length > 2 ? "..." : ""}
                    </TableCell>
                    <TableCell className="text-sm text-light-gray">
                      {(u.skills ?? []).slice(0, 2).join(", ")}
                      {(u.skills ?? []).length > 2 ? "..." : ""}
                    </TableCell>
                    <TableCell className="text-sm">{u.rating ?? 0}</TableCell>
                    <TableCell className="text-sm text-light-gray">
                      {(u.platforms ?? []).slice(0, 2).join(", ")}
                      {(u.platforms ?? []).length > 2 ? "..." : ""}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={u.status ?? "pending"} />
                    </TableCell>

                    {/* ✅ FIXED: only one TableCell here (no nested td) */}
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => goDetails(u.userId)}
                        className="h-9 rounded-md bg-Primary px-4 text-sm font-medium text-white hover:brightness-95 active:scale-[0.98]"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                props.users.map((u) => {
                  const displayName =
                    u.brandName ||
                    `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
                    "—";

                  const status =
                    u.nidVerification?.nidStatus ??
                    (u.isOnboardingComplete ? "pending" : "incomplete");

                  const location = [u.zilla, u.country].filter(Boolean).join(", ") || "—";

                  return (
                    <TableRow key={u.userId ?? u.id}>
                      <TableCell className="font-medium">{displayName}</TableCell>
                      <TableCell className="text-sm text-light-gray">
                        {u.email ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-light-gray">
                        {u.phone ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-light-gray">{location}</TableCell>
                      <TableCell>
                        <StatusPill status={String(status)} />
                      </TableCell>

                      <TableCell className="text-center">
                        <button
                          type="button"
                          onClick={() => goDetails(u.userId ?? u.id)}
                          className="h-9 rounded-md bg-Primary px-4 text-sm font-medium text-white hover:brightness-95 active:scale-[0.98]"
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}