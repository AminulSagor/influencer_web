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

/** Influencer shape (your existing) */
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

/** Client/Agency shape */
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

type Props =
  | { variant: "influencer"; users: InfluencerRow[]; detailsBase?: "users" | "verification-center" }
  | { variant: "agency"; users: ClientRow[]; detailsBase?: "users" | "verification-center" };

function getLocaleFromPath(path: string) {
  const parts = String(path ?? "").split("/").filter(Boolean);
  return parts[0] || "en";
}

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
    if (!userId) return;

    const locale = getLocaleFromPath(pathname);

    // ✅ IMPORTANT: absolute route (no pathname append)
    router.push(`/${locale}/admin/verification-center/${props.variant}/${userId}`);
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
                  <TableCell
                    colSpan={props.variant === "influencer" ? 7 : 6}
                    className="text-center text-sm text-light-gray py-8"
                  >
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

                  const location =
                    [u.zilla, u.country].filter(Boolean).join(", ") || "—";

                  const id = u.userId ?? u.id;

                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{displayName}</TableCell>

                      <TableCell className="text-sm text-light-gray">
                        {u.email ?? "—"}
                      </TableCell>

                      <TableCell className="text-sm text-light-gray">
                        {u.phone ?? "—"}
                      </TableCell>

                      <TableCell className="text-sm text-light-gray">
                        {location}
                      </TableCell>

                      <TableCell>
                        <StatusPill status={String(status)} />
                      </TableCell>

                      <TableCell className="text-center">
                        <button
                          type="button"
                          onClick={() => goDetails(id)}
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