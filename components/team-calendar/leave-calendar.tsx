"use client";

import { useState } from "react";
import { ResponsiveSelect } from "../ui/select";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Badge } from "../ui/badge";

const teamMembers = [
  {
    name: "Kwame Asante",
    role: "Frontend Developer",
    avatar: "KA",
    department: "Software Engineering",
  },
  {
    name: "Yaw Darko",
    role: "SAP Consultant",
    avatar: "YD",
    department: "SAP",
  },
  {
    name: "Akosua Frimpong",
    role: "Project Manager",
    avatar: "AF",
    department: "Project Management",
  },
  {
    name: "Adwoa Sarpong",
    role: "Content Creator",
    avatar: "AS",
    department: "Educational Content Creation",
  },
  {
    name: "Kojo Amponsah",
    role: "HR Specialist",
    avatar: "KA",
    department: "Human Resource",
  },
];

const absences: Record<string, { start: number; end: number; type: string }[]> =
  {
    "Kwame Asante": [{ start: 3, end: 7, type: "Annual" }],
    "Yaw Darko": [{ start: 17, end: 21, type: "Annual" }],
    "Akosua Frimpong": [{ start: 10, end: 14, type: "Annual" }],
    "Adwoa Sarpong": [{ start: 19, end: 19, type: "Sick" }],
    "Kojo Amponsah": [{ start: 25, end: 25, type: "Personal" }],
  };

// const typeColors: Record<string, string> = {
//   Annual: "bg-chart-1/70",
//   Sick: "bg-chart-2/70",
//   Personal: "bg-chart-3/70",
//   Unpaid: "bg-muted-foreground/40",
// };

const daysInMonth = 31;
// const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function LeaveCalendar() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentMonth] = useState("May 2026");

  const departmentOptions = [
    { label: "All Departments", value: "all" },
    ...[...new Set(teamMembers.map((m) => m.department))].map((d) => ({
      label: d,
      value: d.toLowerCase(),
    })),
  ];

  //  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const conflictDays = new Set<number>();
  for (let day = 1; day <= daysInMonth; day++) {
    const engAbsent = teamMembers.filter(
      (m) =>
        m.department === "Engineering" &&
        absences[m.name]?.some((a) => day >= a.start && day <= a.end),
    ).length;
    const engTotal = teamMembers.filter(
      (m) => m.department === "Engineering",
    ).length;
    if (engTotal > 0 && engAbsent / engTotal > 0.2) {
      conflictDays.add(day);
    }
  }

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            Team Calendar
          </h2>
          <p className="text-muted-foreground text-sm">
            Visualize team availability and upcoming birthdays
          </p>
        </div>
        <div className="w-48">
          <ResponsiveSelect
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={departmentOptions}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center gap-1">
          <div className="bg-chart-1/70 mr-2 inline-block h-4 w-4 rounded-full"></div>
          <span className="text-muted-foreground text-xs">Annual</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-chart-5/70 mr-2 inline-block h-4 w-4 rounded-full"></div>
          <span className="text-muted-foreground text-xs">Sick</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-chart-3/70 mr-2 inline-block h-4 w-4 rounded-full"></div>
          <span className="text-muted-foreground text-xs">Personal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="border-destructive/50 bg-destructive/10 size-3 rounded-sm border-2"></div>
          <span className="text-muted-foreground text-xs">Conflict</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeftIcon className="size-4" />
              </Button>
              <p className="text-foreground text-sm">{currentMonth}</p>
              <Button variant="outline" size="sm">
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
            <div>
              <Badge variant="outline" className="text-xs">
                <AlertTriangle className="mr-1 size-4" />
                {conflictDays.size} conflict day
                {conflictDays.size !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div> calendar partt here</div>
        </CardContent>
      </Card>
    </main>
  );
}
