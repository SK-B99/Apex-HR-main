"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import type { useEmployeeViewModel } from "@/viewmodels/useEmployeeViewModel";

type Props = Pick<
  ReturnType<typeof useEmployeeViewModel>,
  | "deptDialogOpen"
  | "deptForm"
  | "deptLoading"
  | "deptError"
  | "deptSuccess"
  | "setDeptField"
  | "handleDeptOpenChange"
  | "handleCreateDepartment"
>;

export default function NewDepartment({
  deptDialogOpen,
  deptForm,
  deptLoading,
  deptError,
  deptSuccess,
  setDeptField,
  handleDeptOpenChange,
  handleCreateDepartment,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-foreground text-lg font-semibold">Departments</h2>
        <p className="text-muted-foreground text-sm">
          Manage and organise your company departments
        </p>
      </div>

      <Dialog open={deptDialogOpen} onOpenChange={handleDeptOpenChange}>
        <DialogTrigger asChild>
          <Button size="sm">New Department +</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
            <DialogDescription>
              Add a new department, define its purpose, and assign a head.
            </DialogDescription>
          </DialogHeader>

          {deptSuccess ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-foreground font-medium">Department Created</p>
              <p className="text-muted-foreground text-sm">
                The department has been added successfully.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleCreateDepartment}
              className="flex flex-col gap-4 pt-2"
            >
              <div className="flex flex-col gap-1.5">
                <Label>Department Name *</Label>
                <Input
                  value={deptForm.name}
                  onChange={setDeptField("name")}
                  placeholder="e.g. Software Development"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Description *</Label>
                <textarea
                  rows={3}
                  value={deptForm.description}
                  onChange={setDeptField("description")}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Describe department..."
                />
              </div>

              {deptError && (
                <p className="text-destructive text-sm">{deptError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDeptOpenChange(false)}
                  disabled={deptLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={deptLoading}>
                  {deptLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Department"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
