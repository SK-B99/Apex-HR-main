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
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { ResponsiveSelect } from "../ui/select";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import type { useEmployeeViewModel } from "@/viewmodels/useEmployeeViewModel";
import { EMPLOYEE_ROLES } from "@/models/employee.types";

type Props = Pick<
  ReturnType<typeof useEmployeeViewModel>,
  | "employeeDialogOpen"
  | "employeeForm"
  | "employeeLoading"
  | "employeeError"
  | "employeeSuccess"
  | "setEmployeeField"
  | "setEmployeeDepartment"
  | "setEmployeeRole"
  | "handleEmployeeOpenChange"
  | "handleAddEmployee"
  | "departments"
>;

export default function AddEmployeeForm({
  employeeDialogOpen,
  employeeForm,
  employeeLoading,
  employeeError,
  employeeSuccess,
  setEmployeeField,
  setEmployeeDepartment,
  setEmployeeRole,
  handleEmployeeOpenChange,
  handleAddEmployee,
  departments,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <Dialog open={employeeDialogOpen} onOpenChange={handleEmployeeOpenChange}>
        <DialogTrigger asChild>
          <Button size="sm">Add Employee +</Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add an Employee</DialogTitle>
            <DialogDescription>
              Add a new employee, details, and assign the person to a
              department.
            </DialogDescription>
          </DialogHeader>

          {employeeSuccess ? (
            <p className="py-10 text-center">Employee Added</p>
          ) : (
            <form
              onSubmit={handleAddEmployee}
              className="flex flex-col gap-4 pt-2"
            >
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>First Name *</FieldLabel>
                  <Input
                    value={employeeForm.firstName}
                    onChange={setEmployeeField("firstName")}
                  />
                </Field>
                <Field>
                  <FieldLabel>Last Name *</FieldLabel>
                  <Input
                    value={employeeForm.lastName}
                    onChange={setEmployeeField("lastName")}
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel>Contact *</FieldLabel>
                  <Input
                    value={employeeForm.contact}
                    onChange={setEmployeeField("contact")}
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel>Department *</FieldLabel>
                  <ResponsiveSelect
                    value={employeeForm.departmentId}
                    onChange={setEmployeeDepartment}
                    options={departments.map((d) => ({
                      label: d.name || "",
                      value: d.id || "",
                    }))}
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel>Role *</FieldLabel>
                  <ResponsiveSelect
                    placeholder="Select role"
                    value={employeeForm.role}
                    onChange={setEmployeeRole}
                    options={EMPLOYEE_ROLES.map((r) => ({
                      label: r.name,
                      value: r.id,
                    }))}
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel>House Address *</FieldLabel>
                  <Input
                    value={employeeForm.houseAddress}
                    onChange={setEmployeeField("houseAddress")}
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel>Date of Birth *</FieldLabel>
                  <Input
                    type="date"
                    value={employeeForm.dateOfBirth}
                    onChange={setEmployeeField("dateOfBirth")}
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel>Work Email *</FieldLabel>
                  <Input
                    type="email"
                    value={employeeForm.workEmail}
                    onChange={setEmployeeField("workEmail")}
                  />
                </Field>
                {employeeError && (
                  <p className="text-destructive text-sm md:col-span-2">
                    {employeeError}
                  </p>
                )}
              </FieldGroup>

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEmployeeOpenChange(false)}
                  disabled={employeeLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={employeeLoading}
                >
                  {employeeLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Add Employee"
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
