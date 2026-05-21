"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  Check,
  X,
  MessageSquare,
  Calendar,
  Building2,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type WorkflowStep = {
  step: string;
  user: string;
  status: "completed" | "current" | "pending";
  action: string;
};

type ApprovalRequest = {
  id: string;
  employee: string;
  avatar: string;
  role: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  submittedAt: string;
  workflow: WorkflowStep[];
  conflict: boolean;
  conflictDetails?: string;
};

const approvalQueue: ApprovalRequest[] = [
  {
    id: "LR-2024-089",
    employee: "Kwame Asante",
    avatar: "KA",
    role: "Frontend Developer",
    department: "Engineering",
    type: "Annual",
    startDate: "Mar 3, 2026",
    endDate: "Mar 7, 2026",
    days: 5,
    reason:
      "Family vacation - travelling to visit parents in Kumasi. Will ensure all sprint work is completed and handed off before departure.",
    submittedAt: "Feb 15, 2026",
    workflow: [
      {
        step: "Submitted",
        user: "Kwame Asante",
        status: "completed",
        action: "Submitted",
      },
      {
        step: "Team Lead",
        user: "Abena Mensah",
        status: "current",
        action: "Review",
      },
      {
        step: "Dept Head",
        user: "Kofi Boateng",
        status: "pending",
        action: "Approve",
      },
    ],
    conflict: true,
    conflictDetails:
      "Ama Owusu (UX Designer) is also off Mar 3-5. Engineering dept will be at 22% absence.",
  },
  {
    id: "LR-2024-090",
    employee: "Yaw Darko",
    avatar: "YD",
    role: "DevOps Engineer",
    department: "Engineering",
    type: "Annual",
    startDate: "Mar 17, 2026",
    endDate: "Mar 21, 2026",
    days: 5,
    reason: "Easter break trip with family to Cape Coast.",
    submittedAt: "Feb 14, 2026",
    workflow: [
      {
        step: "Submitted",
        user: "Yaw Darko",
        status: "completed",
        action: "Submitted",
      },
      {
        step: "Team Lead",
        user: "Efua Amoah",
        status: "completed",
        action: "Commented",
      },
      {
        step: "Dept Head",
        user: "Abena Mensah",
        status: "current",
        action: "Approve",
      },
    ],
    conflict: false,
  },
  {
    id: "LR-2024-091",
    employee: "Akosua Frimpong",
    avatar: "AF",
    role: "QA Engineer",
    department: "Engineering",
    type: "Annual",
    startDate: "Mar 10, 2026",
    endDate: "Mar 14, 2026",
    days: 5,
    reason: "Visiting family in Tamale - annual trip.",
    submittedAt: "Feb 13, 2026",
    workflow: [
      {
        step: "Submitted",
        user: "Akosua Frimpong",
        status: "completed",
        action: "Submitted",
      },
      {
        step: "Team Lead",
        user: "Efua Amoah",
        status: "current",
        action: "Review",
      },
      {
        step: "Dept Head",
        user: "Kofi Boateng",
        status: "pending",
        action: "Approve",
      },
    ],
    conflict: false,
  },
  {
    id: "LR-2024-092",
    employee: "Adwoa Sarpong",
    avatar: "AS",
    role: "Data Analyst",
    department: "Product",
    type: "Sick",
    startDate: "Feb 19, 2026",
    endDate: "Feb 19, 2026",
    days: 1,
    reason: "Dental surgery follow-up appointment.",
    submittedAt: "Feb 18, 2026",
    workflow: [
      {
        step: "Submitted",
        user: "Adwoa Sarpong",
        status: "completed",
        action: "Submitted",
      },
      {
        step: "Manager",
        user: "Abena Mensah",
        status: "current",
        action: "Approve",
      },
    ],
    conflict: false,
  },
  {
    id: "LR-2024-093",
    employee: "Kojo Amponsah",
    avatar: "KA",
    role: "Sales Rep",
    department: "Sales",
    type: "Personal",
    startDate: "Feb 25, 2026",
    endDate: "Feb 25, 2026",
    days: 1,
    reason: "Home renovation - contractor visit.",
    submittedAt: "Feb 17, 2026",
    workflow: [
      {
        step: "Submitted",
        user: "Kojo Amponsah",
        status: "completed",
        action: "Submitted",
      },
      {
        step: "Manager",
        user: "Abena Mensah",
        status: "current",
        action: "Approve",
      },
    ],
    conflict: false,
  },
];

const stepStatusColors: Record<string, string> = {
  completed: "bg-success text-success-foreground",
  current: "bg-primary text-primary-foreground",
  pending: "bg-muted text-muted-foreground",
};

const typeColors: Record<string, string> = {
  Annual: "bg-blue-500/10 text-blue-600",
  Sick: "bg-red-500/10 text-red-600",
  Personal: "bg-purple-500/10 text-purple-600",
};

export default function ApprovalsPage() {
  const [selectedRequest, setSelectedRequest] =
    useState<ApprovalRequest | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-foreground text-lg font-semibold">Approvals</h2>
        <p className="text-muted-foreground text-sm">
          Review and action pending leave requests
        </p>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        <Card className="p-5 text-center">
          <div className="bg-warning/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-xl">
            <Clock className="text-warning h-4 w-4" />
          </div>
          <p className="text-foreground text-2xl font-semibold">7</p>
          <p className="text-muted-foreground text-sm">Awaiting your review</p>
        </Card>
        <Card className="p-5 text-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-xl">
            <AlertTriangle className="text-destructive h-4 w-4" />
          </div>
          <p className="text-foreground text-2xl font-semibold">2</p>
          <p className="text-muted-foreground text-sm">Conflict Warnings</p>
        </Card>
        <Card className="p-5 text-center">
          <div className="bg-primary/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-xl">
            <Clock className="text-primary h-4 w-4" />
          </div>
          <p className="text-foreground text-2xl font-semibold">5h</p>
          <p className="text-muted-foreground text-sm">Average Response Time</p>
        </Card>
      </div>

      {/* Queue + Detail */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Queue */}
        <div className="flex flex-col gap-2 lg:col-span-2">
          <h3 className="text-muted-foreground mb-1 px-1 text-sm font-medium">
            Queue ({approvalQueue.length})
          </h3>
          {approvalQueue.map((req) => (
            <Card
              key={req.id}
              className={`hover:border-primary/30 cursor-pointer transition-all ${
                selectedRequest?.id === req.id
                  ? "border-primary ring-primary/20 ring-1"
                  : ""
              }`}
              onClick={() => setSelectedRequest(req)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="mt-0.5 size-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {req.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-foreground text-sm font-semibold">
                        {req.employee}
                      </p>
                      {req.conflict && (
                        <AlertTriangle className="text-destructive size-4" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {req.role} · {req.department}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 text-[10px]"
                      >
                        {req.type}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {req.days} day{req.days > 1 ? "s" : ""}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {req.startDate}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail Panel */}
        <Card className="flex flex-col lg:col-span-3">
          {selectedRequest ? (
            <>
              <CardHeader className="border-b pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {selectedRequest.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground font-semibold">
                        {selectedRequest.employee}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {selectedRequest.role} · {selectedRequest.department}
                      </p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {selectedRequest.id}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-5 pt-5">
                {/* Conflict Warning */}
                {selectedRequest.conflict && (
                  <div className="bg-destructive/10 border-destructive/20 flex items-start gap-2 rounded-lg border px-3 py-2.5">
                    <AlertTriangle className="text-destructive mt-0.5 size-4 shrink-0" />
                    <p className="text-destructive text-xs">
                      {selectedRequest.conflictDetails}
                    </p>
                  </div>
                )}

                {/* Leave Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
                      <Calendar className="text-muted-foreground size-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px]">
                        Start Date
                      </p>
                      <p className="text-foreground text-sm font-medium">
                        {selectedRequest.startDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
                      <Calendar className="text-muted-foreground size-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px]">
                        End Date
                      </p>
                      <p className="text-foreground text-sm font-medium">
                        {selectedRequest.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
                      <Building2 className="text-muted-foreground size-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px]">
                        Duration
                      </p>
                      <p className="text-foreground text-sm font-medium">
                        {selectedRequest.days} day
                        {selectedRequest.days > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-lg">
                      <User className="text-muted-foreground size-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[11px]">
                        Leave Type
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[selectedRequest.type] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {selectedRequest.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                    Reason
                  </p>
                  <p className="text-foreground bg-muted/40 rounded-lg px-3 py-2.5 text-sm leading-relaxed">
                    {selectedRequest.reason}
                  </p>
                </div>

                {/* Workflow */}
                <div>
                  <p className="text-muted-foreground mb-3 text-xs font-medium">
                    Approval Workflow
                  </p>
                  <div className="flex items-center gap-1">
                    {selectedRequest.workflow.map((step, i) => (
                      <div key={i} className="flex flex-1 items-center gap-1">
                        <div className="flex flex-1 flex-col items-center">
                          <div
                            className={`flex size-7 items-center justify-center rounded-full text-[10px] font-semibold ${stepStatusColors[step.status]}`}
                          >
                            {step.status === "completed" ? (
                              <Check className="size-3.5" />
                            ) : (
                              i + 1
                            )}
                          </div>
                          <p className="text-muted-foreground mt-1 text-center text-[10px]">
                            {step.step}
                          </p>
                          <p className="text-foreground w-full truncate px-1 text-center text-[10px] font-medium">
                            {step.user}
                          </p>
                        </div>
                        {i < selectedRequest.workflow.length - 1 && (
                          <div
                            className={`mb-5 h-px flex-1 ${step.status === "completed" ? "bg-success" : "bg-border"}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 border-t pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                  >
                    <MessageSquare className="size-3.5" />
                    Comment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 flex-1 gap-1.5"
                  >
                    <X className="size-3.5" />
                    Reject
                  </Button>
                  <Button size="sm" className="flex-1 gap-1.5">
                    <Check className="size-3.5" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
              <div className="bg-muted mb-3 flex size-12 items-center justify-center rounded-xl">
                <Clock className="text-muted-foreground size-5" />
              </div>
              <p className="text-foreground text-sm font-medium">
                No request selected
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Click a request from the queue to review it
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
