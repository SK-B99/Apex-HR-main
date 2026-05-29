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
import { Label } from "../ui/label";
import { ResponsiveSelect } from "../ui/select";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { useLeaveRequestViewModel } from "@/viewmodels/useLeaveRequestViewModel";

export default function NewRequest() {
  const {
    dialogOpen,
    form,
    setForm,
    submitLoading,
    submitError,
    submitSuccess,
    handleDialogOpenChange,
    handleSubmit,
    policies,
    loadingPolicies,
  } = useLeaveRequestViewModel();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            Leave Requests
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage and track all time-off requests
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
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

            {submitSuccess ? (
              <p className="py-10 text-center font-medium text-green-600">
                Request submitted successfully!
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-4 py-2">
                  <div className="flex flex-col gap-1.5">
                    <Label>Leave Type</Label>
                    {loadingPolicies ? (
                      <p className="text-muted-foreground text-sm">
                        Loading policies...
                      </p>
                    ) : (
                      <ResponsiveSelect
                        placeholder="Select leave type"
                        options={policies.map((p) => ({
                          label: p.name,
                          value: p.id,
                        }))}
                        value={form.leavePolicyId}
                        onChange={(v) =>
                          setForm((f) => ({ ...f, leavePolicyId: v }))
                        }
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={form.startDate}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            startDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={form.endDate}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, endDate: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Switch
                      id="half-day"
                      checked={form.isHalfDay}
                      onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, isHalfDay: v }))
                      }
                    />
                    <Label
                      htmlFor="half-day"
                      className="text-foreground text-sm"
                    >
                      Half-day request
                    </Label>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Reason</Label>
                    <Textarea
                      rows={3}
                      placeholder="Brief description of your time off (min 10 characters)..."
                      value={form.reason}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, reason: e.target.value }))
                      }
                    />
                  </div>

                  {submitError && (
                    <p className="text-destructive text-sm">{submitError}</p>
                  )}

                  <div className="bg-secondary/95 rounded-lg border p-3">
                    <div className="flex items-center gap-4 text-sm">
                      <AlertCircle className="text-primary size-4" />
                      <span>Approval Workflow</span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      Your request will be routed: You → Dept Head (Approve) →
                      HR Admin (Final Approval)
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-5">
                  <Button
                    variant="outline"
                    onClick={() => handleDialogOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitLoading}>
                    {submitLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
