"use client";

import {
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/15 text-warning-foreground border-0",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-success/15 text-success border-0",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/15 text-destructive border-0",
  },
};

const typeColors: Record<string, string> = {
  Annual: "bg-chart-1/10 text-chart-1",
  Sick: "bg-chart-2/10 text-chart-2",
  Personal: "bg-chart-3/10 text-chart-3",
  Unpaid: "bg-muted text-muted-foreground",
};

export default function LeaveRequestCards() {
  const requests = [
    {
      id: "LR-2024-089",
      employee: "Sarah Mitchell",
      avatar: "SM",
      role: "HR Admin",
      type: "Annual",
      startDate: "Mar 3, 2026",
      endDate: "Mar 7, 2026",
      days: 5,
      status: "pending",
      submittedAt: "Feb 15, 2026",
      reason: "Family vacation",
      approver: "David Kim",
      comments: 1,
    },
    {
      id: "LR-2024-088",
      employee: "Alex Chen",
      avatar: "AC",
      role: "Frontend Developer",
      type: "Sick",
      startDate: "Feb 18, 2026",
      endDate: "Feb 18, 2026",
      days: 1,
      status: "approved",
      submittedAt: "Feb 17, 2026",
      reason: "Medical appointment",
      approver: "Sarah Mitchell",
      comments: 0,
    },
    {
      id: "LR-2024-087",
      employee: "Maya Patel",
      avatar: "MP",
      role: "UX Designer",
      type: "Annual",
      startDate: "Feb 24, 2026",
      endDate: "Feb 28, 2026",
      days: 5,
      status: "approved",
      submittedAt: "Feb 10, 2026",
      reason: "Wedding anniversary trip",
      approver: "David Kim",
      comments: 2,
    },
    {
      id: "LR-2024-086",
      employee: "James Wilson",
      avatar: "JW",
      role: "Backend Engineer",
      type: "Personal",
      startDate: "Feb 14, 2026",
      endDate: "Feb 14, 2026",
      days: 1,
      status: "rejected",
      submittedAt: "Feb 12, 2026",
      reason: "Moving to new apartment",
      approver: "Lisa Tang",
      comments: 3,
    },
    {
      id: "LR-2024-085",
      employee: "Priya Sharma",
      avatar: "PS",
      role: "Project Manager",
      type: "Sick",
      startDate: "Feb 10, 2026",
      endDate: "Feb 11, 2026",
      days: 2,
      status: "approved",
      submittedAt: "Feb 10, 2026",
      reason: "Flu recovery",
      approver: "David Kim",
      comments: 0,
    },
    {
      id: "LR-2024-084",
      employee: "Tom Baker",
      avatar: "TB",
      role: "Educational Content Creator",
      type: "Annual",
      startDate: "Mar 17, 2026",
      endDate: "Mar 21, 2026",
      days: 5,
      status: "pending",
      submittedAt: "Feb 14, 2026",
      reason: "Spring break with family",
      approver: "Lisa Tang",
      comments: 0,
    },
    {
      id: "LR-2024-083",
      employee: "Li Wei",
      avatar: "LW",
      role: "SAP Consultant",
      type: "Annual",
      startDate: "Mar 10, 2026",
      endDate: "Mar 14, 2026",
      days: 5,
      status: "pending",
      submittedAt: "Feb 13, 2026",
      reason: "Visiting family abroad",
      approver: "Lisa Tang",
      comments: 1,
    },
  ];

  const renderRow = (req: (typeof requests)[number], showActions = false) => {
    const statusInfo = statusConfig[req.status];
    const StatusIcon = statusInfo.icon;
    return (
      <div
        key={req.id}
        className="hover:bg-muted/30 flex cursor-pointer items-center gap-4 p-4 transition-colors"
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {req.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-foreground text-sm font-medium">
              {req.employee}
            </p>
            <span className="text-muted-foreground text-xs">{req.id}</span>
          </div>
          <p className="text-muted-foreground text-xs">{req.role}</p>
        </div>
        <Badge
          variant="outline"
          className={`border-0 text-[10px] ${typeColors[req.type] || ""}`}
        >
          {req.type}
        </Badge>
        <div className="min-w-28 text-right">
          <p className="text-foreground text-sm">{req.startDate}</p>
          {req.days > 1 && (
            <p className="text-muted-foreground text-xs">to {req.endDate}</p>
          )}
        </div>
        <div>
          <p className="text-foreground text-sm">{req.days}</p>
          <p className="text-muted-foreground text-xs">
            day{req.days > 1 ? "s" : ""}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`gap-1 text-[10px] ${statusInfo.className}`}
        >
          <StatusIcon className="size-3" />
          {statusInfo.label}
        </Badge>
        {req.comments > 0 && (
          <div className="text-muted-foreground flex items-center gap-1">
            <MessageSquare className="size-3.5" />
            <span className="text-xs">{req.comments}</span>
          </div>
        )}
        {showActions ? (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="text-success border-success/30 hover:bg-success/10 hover:text-success h-7 px-2.5 text-xs"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-7 px-2.5 text-xs"
            >
              Reject
            </Button>
          </div>
        ) : (
          <ChevronRight className="text-muted-foreground size-4" />
        )}
      </div>
    );
  };

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">
          All
          <Badge variant="secondary" className="ml-1.5 h-5 text-[10px]">
            {requests.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending
          <Badge
            variant="secondary"
            className="bg-warning/15 text-warning-foreground ml-1.5 h-5 text-[10px]"
          >
            {requests.filter((r) => r.status === "pending").length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y">
              {requests.map((req) => renderRow(req))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pending">
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y">
              {requests
                .filter((r) => r.status === "pending")
                .map((req) => renderRow(req, true))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="approved">
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y">
              {requests
                .filter((r) => r.status === "approved")
                .map((req) => renderRow(req))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rejected">
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y">
              {requests
                .filter((r) => r.status === "rejected")
                .map((req) => renderRow(req))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
