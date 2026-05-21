"use client";

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const monthlyData = [
  { month: "Jan", approved: 10, rejected: 2 },
  { month: "Feb", approved: 7, rejected: 0 },
  { month: "Mar", approved: 12, rejected: 1 },
  { month: "Apr", approved: 15, rejected: 0 },
  { month: "May", approved: 20, rejected: 2 },
  { month: "Jun", approved: 22, rejected: 3 },
];

const deptAbsences = [
  { dept: "IT", count: 2 },
  { dept: "SAP", count: 2 },
  { dept: "HR", count: 1 },
  { dept: "PM", count: 3 },
  { dept: "Aux", count: 0 },
  { dept: "CC", count: 5 },
];

export default function ReqDepChart() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Request Trends Chart */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Request Trends</CardTitle>
          <CardDescription>
            Monthly leave requests over the past 6 months
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="colorApproved"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="oklch(0.55 0.19 255)"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.55 0.19 255)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="approved"
                  stroke="oklch(0.55 0.19 180)"
                  fill="url(#colorApproved)"
                />

                <Area
                  type="monotone"
                  dataKey="rejected"
                  stroke="oklch(0.577 0.245 27.325)"
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Department Absences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Today by Department</CardTitle>
          <CardDescription>Employees absent per department</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAbsences}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="oklch(0.5 2 180)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
