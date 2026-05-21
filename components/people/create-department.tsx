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
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";

const BASE_URL = "https://jamika-unexaggerating-camila.ngrok-free.dev";

type FormState = {
  name: string;
  description: string;
  head: string;
  parentId: string;
};

const EMPTY: FormState = {
  name: "",
  description: "",
  head: "",
  parentId: "",
};

export default function NewDepartment() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setError("All required fields must be filled.");
      return;
    }

    setLoading(true);
    setError(null);

    const accessToken = getAccessToken();

    if (!accessToken) {
      setError("Access token not found. Please log in again.");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      // departmentHeadId: form.head,
      // parentId: form.parentId || undefined,
    };

    try {
      const response = await fetch(`${BASE_URL}/v1/department`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(", ")
            : data?.message || "Failed to create department.",
        );
      }

      setSuccess(true);
      setTimeout(() => handleOpenChange(false), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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
      <div>
        <h2 className="text-foreground text-lg font-semibold">Departments</h2>
        <p className="text-muted-foreground text-sm">
          Manage and organise your company departments
        </p>
      </div>

      <div className="flex items-center">
        {/* <div className="mr-20">
          <AddEmployeeForm />
        </div> */}
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
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

            {success ? (
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
                <p className="text-foreground font-medium">
                  Department Created
                </p>
                <p className="text-muted-foreground text-sm">
                  The department has been added successfully.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 pt-2"
              >
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <Label>Department Name *</Label>
                  <Input
                    value={form.name}
                    onChange={set("name")}
                    placeholder="e.g. Software Development"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <Label>Description *</Label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={set("description")}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Describe department..."
                  />
                </div>

                {/* Department Head ID */}
                {/* <div className="flex flex-col gap-1.5">
                  <Label>Department Head  *</Label>
                  <Input
                    value={form.head}
                    onChange={set("head")}
                    placeholder="Enter user/employee ID"
                  />
                </div> */}

                {/* Parent Department (optional) */}
                {/* <div className="flex flex-col gap-1.5">
                  <Label>Parent Department (optional)</Label>
                  <Input
                    value={form.parentId}
                    onChange={set("parentId")}
                    placeholder="Optional parent department ID"
                  />
                </div> */}

                {error && <p className="text-destructive text-sm">{error}</p>}

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
                      "Create Department"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
