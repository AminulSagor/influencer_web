"use client";
import { useState } from "react";
import VerificationCardGrid from "./verification-card-grid";
import {
  verificationData,
  verificationTableData,
  VerificationTableRow,
} from "./verification-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa";
import NicheCell from "./niche-cell";
import Link from "next/link";

const VerificationCardsContainer = () => {
  const [selectedId, setSelectedId] = useState<number | null>(1);

  const selectedCard = verificationData.find((item) => item.id === selectedId);

  const rows: VerificationTableRow[] = selectedCard
    ? verificationTableData[selectedCard.label]
    : [];

  return (
    <>
      <VerificationCardGrid
        data={verificationData}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {selectedCard && (
        <div className="mt-6 space-y-2">
          <div className="border border-light-green bg-Secondary p-2 rounded-md ">
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
                <Select>
                  <SelectTrigger className="bg-white border border-light-green text-sm">
                    <SelectValue placeholder="Influencer Promotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delete">Influencer Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md overflow-hidden border">
            <Table>
              <TableHeader>
                <TableRow className="bg-light-green hover:bg-light-green">
                  <TableHead className="w-[40px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Niche</TableHead>
                  <TableHead className="text-white">Pending Items</TableHead>
                  <TableHead className="text-white">
                    Approval Progress
                  </TableHead>
                  <TableHead className="text-white text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <p>{row.name}</p>
                    </TableCell>
                    <TableCell>
                      <NicheCell niches={row.niche} />
                    </TableCell>
                    <TableCell>
                      <p>{row.pendingItems}</p>
                    </TableCell>
                    <TableCell>
                      <div className="w-[180px] space-y-1">
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Progress</span>
                          <span className="text-Primary">
                            {row.approvalProgress}%
                          </span>
                        </div>
                        <div className="h-2 bg-light-green/30 rounded-full">
                          <div
                            className="h-full bg-light-green rounded-full transition-all"
                            style={{ width: `${row.approvalProgress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/verification-center/${selectedCard?.label.toLowerCase()}/${
                          row.id
                        }`}
                      >
                        <Button variant={"outline"}>
                          <FaEye />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationCardsContainer;
