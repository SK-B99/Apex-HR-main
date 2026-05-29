// components/people/edit-employee.tsx

"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { ResponsiveSelect } from "../ui/select";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { EMPLOYEE_ROLES } from "@/models/employee.types";
import type { Employee, ApiDepartment } from "@/models/employee.types";

type EditForm = {
  firstName: string;
  lastName: string;
  contact: string;
  houseAddress: string;
  dateOfBirth: string;
  role: string;
  departmentId: string;
  email: string;
};

type Props = {
  open: boolean;
  employee: Employee | null;
  form: EditForm;
  loading: boolean;
  error: string | null;
  success: boolean;
  departments: ApiDepartment[];
  onOpenChange: (open: boolean) => void;
  onFieldChange: (key: keyof EditForm, value: string) => void;
  onSubmit: () => void;
};

export default function EditEmployeeDialog({
  open,
  employee,
  form,
  loading,
  error,
  success,
  departments,
  onOpenChange,
  onFieldChange,
  onSubmit,
}: Props) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update details for {employee.name}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <p className="py-10 text-center font-medium text-green-600">
            Employee updated successfully!
          </p>
        ) : (
          <div className="flex flex-col gap-4 pt-2">
            <FieldGroup className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  value={form.firstName}
                  onChange={(e) => onFieldChange("firstName", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  value={form.lastName}
                  onChange={(e) => onFieldChange("lastName", e.target.value)}
                />
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => onFieldChange("email", e.target.value)}
                />
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel>Contact</FieldLabel>
                <Input
                  value={form.contact}
                  onChange={(e) => onFieldChange("contact", e.target.value)}
                />
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel>House Address</FieldLabel>
                <Input
                  value={form.houseAddress}
                  onChange={(e) =>
                    onFieldChange("houseAddress", e.target.value)
                  }
                />
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel>Date of Birth</FieldLabel>
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => onFieldChange("dateOfBirth", e.target.value)}
                />
              </Field>
              {/* ✅ Role can be updated — maps to Role enum on backend */}
              <Field className="md:col-span-2">
                <FieldLabel>Role</FieldLabel>
                <ResponsiveSelect
                  value={form.role}
                  onChange={(v) => onFieldChange("role", v)}
                  options={EMPLOYEE_ROLES.map((r) => ({
                    label: r.name,
                    value: r.id,
                  }))}
                />
              </Field>
              {/* ✅ Department can be changed */}
              <Field className="md:col-span-2">
                <FieldLabel>Department</FieldLabel>
                <ResponsiveSelect
                  value={form.departmentId}
                  onChange={(v) => onFieldChange("departmentId", v)}
                  options={departments.map((d) => ({
                    label: d.name || "",
                    value: d.id || "",
                  }))}
                />
              </Field>

              {error && (
                <p className="text-destructive text-sm md:col-span-2">
                  {error}
                </p>
              )}
            </FieldGroup>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={onSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
