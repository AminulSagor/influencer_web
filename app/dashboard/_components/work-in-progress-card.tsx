import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightIcon,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { RiUser3Fill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";
import { Slider } from "@/components/ui/slider";
import { FaArrowRightLong } from "react-icons/fa6";

const WorkInProgressData = [
  {
    id: 1,
    title: "Summer Fashion Campaign",
    progress: 75,
    dueDate: "Dec 15, 2025",
    dueInDays: 3,
    client: "StyleCo",
    budget: "111,000",
  },
  {
    id: 2,
    title: "Q4 Financial Report",
    progress: 20,
    dueDate: "Jan 10, 2026",
    dueInDays: 32,
    client: "Acme Corp",
    budget: "55,000",
  },
  {
    id: 3,
    title: "Website Redesign Phase 2",
    progress: 90,
    dueDate: "Nov 30, 2025",
    dueInDays: -9, // Indicates overdue
    client: "WebTech",
    budget: "350,000",
  },
];

const WorkInProgressCard = () => {
  return (
    <Card>
      <CardHeader className="border-b flex items-center justify-between">
        <CardTitle className="text-[#2D5016]">Work in progress</CardTitle>
        <CardAction>
          <Button className="bg-[#7A9B57]/90 hover:bg-[#7a9b57]" size={"sm"}>
            4 Active
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {WorkInProgressData.map((data) => (
          <div className="border p-4 rounded-lg shadow-sm" key={data.id}>
            <div className="flex justify-between items-center space-y-1">
              <div className="space-y-1">
                <h3 className="font-semibold text-[#2d5016]">{data.title}</h3>
                <p className="text-[#7A9B57] text-lg">{data.progress}%</p>
              </div>
              <div>
                <div className="bg-yellow-600/30 border-yellow-700 border px-4 py-1 rounded-lg flex justify-center items-center">
                  <span className="text-yellow-700 text-sm font-medium">
                    Due: {data.dueInDays} Days
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-1">
              <span>
                <RiUser3Fill size={12} className="fill-yellow-600" />
              </span>
              <span className="text-xs text-yellow-600">{data.client}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span>
                  <FaClock size={12} className="fill-yellow-600" />
                </span>
                <span className="text-xs text-yellow-600">{data.dueDate}</span>
              </div>
              <p className="text-[#7A9B57]  font-semibold">
                Budget: ৳ {data.budget}
              </p>
            </div>
            <div className="pt-2">
              <Slider defaultValue={[data.progress]} max={100} step={1} />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-yellow-600 text-sm">
                {data.progress}% Complete
              </p>
              <Button variant="link" size={"sm"} className="p-0">
                <Link href={"/"} className="flex items-center text-xs">
                  View <ChevronRight />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-center">
        <Button className="px-40 bg-[#F5F5DC]/60 text-[#2D5016] border-[#2D5016] border hover:bg-[#F5F5DC] hover:text-[#2D5016] hover:border-[#2D5016] cursor-pointer">
          View All Jobs
          <span>
            <FaArrowRightLong />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkInProgressCard;
