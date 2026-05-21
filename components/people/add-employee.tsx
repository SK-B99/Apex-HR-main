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
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { ResponsiveSelect } from "../ui/select";
import { Field, FieldGroup, FieldLabel } from "../ui/field";

const BASE_URL = "https://hermit-jogger-equinox.ngrok-free.dev";

type FormState = {
  firstName: string;
  lastName: string;
  contact: string;
  departmentId: string;
  role: string;
  houseAddress: string;
  dateOfBirth: string;
  workEmail: string;
};

type Department = {
  id: string;
  name: string;
};

type CreatedEmployee = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  contact: string;
  role: string;
  department: string;
  location: string;
  status: string;
  dateofbirth: string;
};

type AddEmployeeFormProps = {
  onEmployeeCreated: (employee: CreatedEmployee) => void;
};

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  contact: "",
  departmentId: "",
  role: "",
  houseAddress: "",
  dateOfBirth: "",
  workEmail: "",
};

const roles = [
  { id: "EMPLOYEE", name: "Employee" },
  { id: "TEAM_LEAD", name: "Team Lead" },
  { id: "DEPT_HEAD", name: "Department Head" },
  { id: "HR_ADMIN", name: "HR Admin" },
  { id: "TENANT_ADMIN", name: "Tenant Admin" },
];

export default function AddEmployeeForm({
  onEmployeeCreated,
}: AddEmployeeFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/v1/department`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await res.json();
        const list = data?.data ?? data;
        setDepartments(Array.isArray(list) ? list : []);
      } catch {
        console.error("Failed to fetch departments");
      }
    };

    fetchDepartments();
  }, []);

  const set =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const setDepartment = (value: string) =>
    setForm((f) => ({ ...f, departmentId: value }));

  const setRole = (value: string) => setForm((f) => ({ ...f, role: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasEmptyField = Object.values(form).some(
      (v) => !v || v.toString().trim() === "",
    );

    if (hasEmptyField) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const token = getAccessToken();
    if (!token) {
      setError("Access token not found.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          contact: form.contact.trim(),
          departmentId: form.departmentId,
          role: form.role,
          houseAddress: form.houseAddress.trim(),
          dateOfBirth: form.dateOfBirth,
          email: form.workEmail.trim(),
        }),
      });

      const data = await res.json();
      // console.log("departments response:", data);

      if (!res.ok) throw new Error(data?.message || "Failed");

      const deptName =
        departments.find((d) => d.id === form.departmentId)?.name || "";

      onEmployeeCreated({
        id: data?.id,
        name: `${form.firstName} ${form.lastName}`,
        avatar: `${form.firstName[0]}${form.lastName[0]}`,
        email: form.workEmail,
        contact: form.contact,
        role: form.role,
        department: deptName,
        location: form.houseAddress,
        status: "active",
        dateofbirth: form.dateOfBirth,
      });

      setSuccess(true);
      setTimeout(() => handleOpenChange(false), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setForm(EMPTY);
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
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

          {success ? (
            <p className="py-10 text-center">Employee Added</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>First Name *</FieldLabel>
                  <Input value={form.firstName} onChange={set("firstName")} />
                </Field>

                <Field>
                  <FieldLabel>Last Name *</FieldLabel>
                  <Input value={form.lastName} onChange={set("lastName")} />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Contact *</FieldLabel>
                  <Input value={form.contact} onChange={set("contact")} />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Department *</FieldLabel>
                  <ResponsiveSelect
                    value={form.departmentId}
                    onChange={setDepartment}
                    options={departments.map((d) => ({
                      label: d.name,
                      value: d.id,
                    }))}
                  />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Role *</FieldLabel>
                  <ResponsiveSelect
                    placeholder="Select role"
                    value={form.role}
                    onChange={setRole}
                    options={roles.map((r) => ({
                      label: r.name,
                      value: r.id,
                    }))}
                  />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>House Address *</FieldLabel>
                  <Input
                    value={form.houseAddress}
                    onChange={set("houseAddress")}
                  />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Date of Birth *</FieldLabel>
                  <Input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={set("dateOfBirth")}
                  />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Work Email *</FieldLabel>
                  <Input
                    type="email"
                    value={form.workEmail}
                    onChange={set("workEmail")}
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
                  onClick={() => handleOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
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
