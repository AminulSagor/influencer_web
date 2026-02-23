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
import { usePathname } from "next/navigation";
import { useState } from "react";
import UserCardItem from "./user-card-item";
import { Influencer } from "./user-type";
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
import { InfluencerListItem } from "@/types/admin/user/influencer-list_type";

function capitalizeFirstLetter(text?: string): string {
  if (!text) return "";
  return text[0].toUpperCase() + text.slice(1);
}

interface Props {
  users: InfluencerListItem[];
}

const UserCard = ({ users }: Props) => {
  const [view, setView] = useState<"list" | "grid">("list");
  const pathname = usePathname();
  const url = pathname.split("/").pop();
  const cardTitle = capitalizeFirstLetter(url);

  const [activeTab, setActiveTab] = useState<"all" | "blocked">("all");

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
            <CardDescription>Browse {url} and their details</CardDescription>
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
        {/* search bar */}
        <div className="flex justify-between items-center gap-4 mx-2">
          <div className="flex-1">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input placeholder="Search by campaign name" className="pl-10" />
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
              <div>
                <div className="bg-light-green px-4 py-1.5 border rounded-md border-Primary text-white text-sm">
                  1 selected
                </div>
              </div>
              <div>
                <Select>
                  <SelectTrigger className="bg-white border border-light-green text-sm w-[180px]">
                    <SelectValue placeholder="Bulk Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm">
                  <SelectValue placeholder="Nov 20 - Dec 20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Nov 20 - Dec 20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {view === "list" ? (
          <div>
            <div className="rounded-md overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-light-green hover:bg-light-green">
                    <TableHead className="w-[40px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Niche</TableHead>
                    <TableHead className="text-white">Ratings</TableHead>
                    <TableHead className="text-white">Platforms</TableHead>
                    <TableHead className="text-white text-center">
                      Active Jobs
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
                    <TableRow key={user.userId}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Link
                          href={"/admin/users/influencer/" + user.userId}
                          className="flex items-center gap-2"
                        >
                          <Avatar>
                            <AvatarImage src={"/img"} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <p>{user.name}</p>
                        </Link>
                      </TableCell>
                      <TableCell>{user.niches.join(", ")}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <span>
                          <Star
                            size={20}
                            className="fill-yellow-500 text-yellow-500"
                          />
                        </span>
                        <span className="font-semibold">{user.rating}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          {user.platforms.map((platform) => (
                            <PlatformIcon
                              key={platform}
                              size={20}
                              className="text-light-green"
                              platform={{ title: platform, nickName: "", link: "" }}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-center font-semibold">
                          {user.stats.activeJob}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-center font-semibold">
                          {user.stats.jobDone}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-center font-semibold">
                          {user.stats.revenue}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <TableCell className="text-center">
                          <Badge
                            variant={user.isVerified ? "lightGreen" : "destructive"}
                          >
                            {user.isVerified ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-2">
            {users.map((user) => (
              <UserCardItem influencer={user} key={user.userId} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
