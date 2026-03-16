"use client";

import { Button } from "@/components/ui/button";
import { Search, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PlatformIcon from "./platform-icon";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import UserCardItem from "./user-card-item";
import { InfluencerListItem, ListMeta } from "@/types/admin/user/user_type";

function capitalizeFirstLetter(text?: string): string {
  if (!text) return "";
  return text[0].toUpperCase() + text.slice(1);
}

function formatCurrency(amount: number) {
  return `৳${new Intl.NumberFormat("en-BD").format(amount ?? 0)}`;
}

interface Props {
  users: InfluencerListItem[];
  meta?: ListMeta;
}

const UserCard = ({ users, meta }: Props) => {
  const [view, setView] = useState<"list" | "grid">("list");
  const [activeTab, setActiveTab] = useState<"all" | "blocked">("all");

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const url = pathname.split("/").pop();
  const cardTitle = capitalizeFirstLetter(url);

  const currentPage = meta?.page ?? Number(searchParams.get("page") ?? "1");
  const totalPages = meta?.totalPages ?? 1;
  const limit = meta?.limit ?? 10;
  const total = meta?.total ?? 0;

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const paginationPages = useMemo(() => {
    if (totalPages <= 1) return [1];

    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);
    pages.add(currentPage);

    if (currentPage - 1 > 1) pages.add(currentPage - 1);
    if (currentPage + 1 < totalPages) pages.add(currentPage + 1);

    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const getButtonClass = (tab: "all" | "blocked") =>
    activeTab === tab
      ? "bg-light-green text-white px-3 py-1 rounded-full px-6"
      : "text-Primary";

  const baseBtn =
    "bg-Secondary text-light-green border border-light-green hover:bg-Secondary/90 hover:text-light-green";
  const activeBtn =
    "bg-light-green text-white hover:bg-light-green/90 hover:text-white";

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-Primary">{cardTitle}</CardTitle>
            <CardDescription>
              Browse {url} and their details
              {meta ? ` • ${meta.total} total` : ""}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="link"
              className={getButtonClass("all")}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>

            <Button
              variant="link"
              className={getButtonClass("blocked")}
              onClick={() => setActiveTab("blocked")}
            >
              Blocked
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center gap-4 mx-2">
          <div className="flex-1">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search by influencer name, phone or email..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-x-2">
            <Button
              className={cn(baseBtn, view === "list" && activeBtn)}
              onClick={() => setView("list")}
            >
              List View
            </Button>

            <Button
              className={cn(baseBtn, view === "grid" && activeBtn)}
              onClick={() => setView("grid")}
            >
              Grid View
            </Button>
          </div>
        </div>

        <div className="border border-light-green bg-Secondary p-2 rounded-md mx-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-light-green px-4 py-1.5 border rounded-md border-Primary text-white text-sm">
                1 Selected
              </div>

              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm w-[180px]">
                  <SelectValue placeholder="Bulk Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-light-green text-white hover:bg-light-green/90">
                Go
              </Button>
            </div>

            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm w-[140px]">
                  <SelectValue placeholder="Niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm w-[190px]">
                  <SelectValue placeholder="Revenue Generated" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Generated</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm w-[160px]">
                  <SelectValue placeholder="Nov 20 - Dec 20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-range">Nov 20 - Dec 20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {view === "list" ? (
          <div className="rounded-md overflow-hidden border">
            <Table>
              <TableHeader>
                <TableRow className="bg-light-green hover:bg-light-green">
                  <TableHead className="w-[40px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Niche</TableHead>
                  <TableHead className="text-white">Rating</TableHead>
                  <TableHead className="text-white">Platforms</TableHead>
                  <TableHead className="text-white text-center">
                    Active Job
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Job Done
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Revenue
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/users/influencer/${user.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar>
                          <AvatarImage src={user.image ?? ""} />
                          <AvatarFallback>
                            {user.name?.[0]?.toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <p>{user.name}</p>
                      </Link>
                    </TableCell>

                    <TableCell>
                      {user.niche.length ? user.niche.join(", ") : "—"}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star size={16} className="fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{user.rating}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {user.platforms.map((platform) => (
                          <PlatformIcon
                            className="text-light-green"
                            key={`${user.id}-${platform}`}
                            size={18}
                            platform={platform}
                          />
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-semibold">
                      {user.activeJobs}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {user.jobDone}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {formatCurrency(user.revenue)}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={
                          user.status === "Approved" ? "lightGreen" : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No influencers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-6 py-5 border-t bg-white">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {startItem} - {endItem}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{total}</span>{" "}
                Campaigns
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {paginationPages.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant="ghost"
                      onClick={() => goToPage(pageNumber)}
                      className={cn(
                        "h-9 w-9 rounded-md p-0",
                        currentPage === pageNumber
                          ? "bg-light-green text-white hover:bg-light-green/90"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-2">
              {users.map((user) => (
                <UserCardItem influencer={user} key={user.id} />
              ))}
            </div>

            <div className="flex items-center justify-between px-2 py-3">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {startItem} - {endItem}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{total}</span>{" "}
                Campaigns
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {paginationPages.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant="ghost"
                      onClick={() => goToPage(pageNumber)}
                      className={cn(
                        "h-9 w-9 rounded-md p-0",
                        currentPage === pageNumber
                          ? "bg-light-green text-white hover:bg-light-green/90"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;