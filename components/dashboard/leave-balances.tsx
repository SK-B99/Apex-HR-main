"use client";

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Palmtree, Stethoscope, Clock, Baby } from "lucide-react";
import Link from "next/link";

const leaveBalances = [
  {
    type: "Annual Leave",
    used: 8,
    total: 20,
    icon: Palmtree,
    color: "text-chart-1",
  },
  {
    type: "Sick Leave",
    used: 2,
    total: 10,
    icon: Stethoscope,
    color: "text-chart-2",
  },
  { type: "Personal", used: 3, total: 3, icon: Clock, color: "text-chart-3" },
  { type: "Parental", used: 0, total: 90, icon: Baby, color: "text-chart-4" },
];

export default function LeaveBalances() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">My Leave Balances</CardTitle>
            <CardDescription>Current fiscal year 2026-2027</CardDescription>
          </div>

          <Link href="/leave-request">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500 bg-green-500 text-white hover:bg-blue-500 hover:text-white"
            >
              Request Leave
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {leaveBalances.map((leave) => (
            <div
              key={leave.type}
              className="bg-card flex flex-col gap-3 rounded-xl border p-4"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`bg-muted flex size-8 items-center justify-center rounded-lg ${leave.color}`}
                >
                  <leave.icon className="size-4" />
                </div>
                <span className="text-foreground text-sm font-medium">
                  {leave.type}
                </span>
              </div>
              <div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-foreground text-2xl font-semibold">
                    {leave.total - leave.used}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    / {leave.total} days
                  </span>
                </div>
                <Progress
                  value={(leave.used / leave.total) * 100}
                  className="h-1.5"
                />
                <p className="text-muted-foreground mt-1.5 text-xs">
                  {leave.used} used
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
