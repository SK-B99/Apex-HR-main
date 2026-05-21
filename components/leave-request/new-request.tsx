"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Label } from "../ui/label";
import { ResponsiveSelect } from "../ui/select";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { AlertCircle } from "lucide-react";

const LEAVE_TYPES = [
  { label: "Annual Leave", value: "annual" },
  { label: "Sick Leave", value: "sick" },
  { label: "Personal", value: "personal" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Parental", value: "parental" },
];

const DEPARTMENTS = [
  { label: "Software Development", value: "Software Development" },
  { label: "SAP", value: "SAP" },
  { label: "Human Resource", value: "Human Resource" },
  {
    label: "Educational Content Creation",
    value: "Educational Content Creation",
  },
  { label: "Corporate Relation", value: "Corporate Relation" },
  { label: "Project Management", value: "Project Management" },
];

export default function NewRequest() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [department, setDepartment] = useState("");

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            Leave Requests
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage and track all time-off requests
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">New Request +</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Leave Request</DialogTitle>
              <DialogDescription>
                Submit a new time-off request for approval
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <Label>Leave Type</Label>
                <ResponsiveSelect
                  placeholder="Select leave type"
                  options={LEAVE_TYPES}
                  value={leaveType}
                  onChange={setLeaveType}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1.5">
                <Label>Department</Label>
                <ResponsiveSelect
                  placeholder="Select department"
                  options={DEPARTMENTS}
                  value={department}
                  onChange={setDepartment}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <Switch id="half-day" />
              <Label htmlFor="id" className="text-foreground text-sm">
                Half-day request
              </Label>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Reason</Label>
              <Textarea
                rows={3}
                placeholder="Brief description of your time off..."
              />
            </div>

            <div className="bg-secondary/95 mt-5 rounded-lg border p-3">
              <div className="flex items-center gap-4 text-sm">
                <AlertCircle className="text-primary size-4" />
                <span>Approval Workflow</span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                {
                  "Your request will be routed: You -> Team Lead (Comment) -> Dept Head (Approve)"
                }
              </p>
            </div>
            <DialogFooter className="mt-5">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {" "}
                cancel{" "}
              </Button>
              <Button onClick={() => setDialogOpen(false)}>
                {" "}
                Submit Request{" "}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
