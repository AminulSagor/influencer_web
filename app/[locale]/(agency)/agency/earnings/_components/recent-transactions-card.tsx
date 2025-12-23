import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaArrowDownLong } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
const recentTransactions = [
  {
    id: 1,
    title: "Payment for ‘Summer Sale’",
    date: "Today, 2:30 PM",
    amount: 20000 - 6, // 19994
    href: "/",
  },
  {
    id: 2,
    title: "Payment for ‘Winter Fest’",
    date: "Yesterday, 4:15 PM",
    amount: 15000 - 6, // 14994
    href: "/",
  },
  {
    id: 3,
    title: "Payment for ‘Spring Launch’",
    date: "Dec 20, 2024, 11:00 AM",
    amount: 18000 - 6,
    href: "/",
  },
  {
    id: 4,
    title: "Payment for ‘Autumn Collection’",
    date: "Dec 18, 2024, 3:45 PM",
    amount: 22000 - 6,
    href: "/",
  },
  {
    id: 5,
    title: "Payment for ‘Black Friday’",
    date: "Nov 29, 2024, 9:00 AM",
    amount: 25000 - 6,
    href: "/",
  },
  {
    id: 6,
    title: "Payment for ‘Cyber Monday’",
    date: "Nov 26, 2024, 2:00 PM",
    amount: 21000 - 6,
    href: "/",
  },
  {
    id: 7,
    title: "Payment for ‘Holiday Special’",
    date: "Dec 24, 2024, 5:30 PM",
    amount: 23000 - 6,
    href: "/",
  },
  {
    id: 8,
    title: "Payment for ‘New Year Bash’",
    date: "Jan 1, 2025, 12:00 AM",
    amount: 27000 - 6,
    href: "/",
  },
];

const RecentTransactionsCard = () => {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-Primary">Recent Transactions</CardTitle>
        <CardDescription>
          Browse and manage your earnings of each campaigns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-[40%] relative">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                className="pl-10"
                placeholder="Search By Job name, client name"
              />
            </div>
            <p className="text-sm text-gray-400">Showing 4 of 20 Results</p>
          </div>
          <div>
            <Button
              size="sm"
              className=" cursor-pointer bg-Secondary border-light-green border text-light-green text-xs hover:bg-Secondary/70"
            >
              <ArrowDown className="mr-1 h-4 w-4" />
              Low To High
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id}>
              <div className="border border-light-green p-2 rounded-lg bg-linear-to-r from-white to-Secondary">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-full bg-linear-to-r from-Secondary to-white flex items-center justify-center border border-light-green text-light-green">
                    <FaArrowDownLong />
                  </div>
                  <div className="flex-1 grow">
                    <h2 className="text-base  text-Primary">
                      {transaction.title}
                    </h2>
                    <p className="text-xs text-gray-400">{transaction.date}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-light-green">৳{transaction.amount}</p>
                      <div>
                        <Button
                          asChild
                          variant={"link"}
                          className="px-0 text-light-green"
                        >
                          <Link href={"/"}>
                            View Campain Details <ChevronRight />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
