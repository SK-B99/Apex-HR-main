"use client";

import {
  Building2,
  Cake,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  Trash2Icon,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { ResponsiveSelect } from "../ui/select";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import AddEmployeeForm from "./add-employee";
import { Button } from "../ui/button";

const BASE_URL = "https://jamika-unexaggerating-camila.ngrok-free.dev";

type Employee = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  contact: string;
  role: string;
  department: string;
  departmentId: string;
  location: string;
  status: string;
  dateofbirth: string;
};

type ApiDepartment = {
  id?: string;
  _id?: string;
  name?: string;
};

type ApiUser = {
  id?: string;
  _id?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  contact?: string;
  role?: string;
  department?: {
    id?: string;
    _id?: string;
    name?: string;
  };
  departmentName?: string;
  houseAddress?: string;
  address?: string;
  status?: string;
  dateOfBirth?: string;
  dateofbirth?: string;
};

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "on-leave", label: "On Leave" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-success/15 text-success border-0",
  },
  "on-leave": {
    label: "On Leave",
    className: "bg-warning/15 text-warning-foreground border-0",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-0",
  },
};

function formatDob(dob?: string): string {
  if (!dob) return "";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return dob;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function normalizeStatus(raw?: string): string {
  if (!raw) return "active";
  const s = raw.toLowerCase();
  if (s.includes("leave")) return "on-leave";
  if (s.includes("inactive")) return "inactive";
  return "active";
}

function getSafeId(user: ApiUser, index: number): string {
  return (
    user?.id || user?._id || user?.userId || user?.email || `employee-${index}`
  );
}

function mapApiUserToEmployee(user: ApiUser, index: number): Employee {
  const firstName = user.firstName || "";
  const lastName = user.lastName || "";

  return {
    id: getSafeId(user, index),
    name: `${firstName} ${lastName}`.trim(),
    avatar: `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase(),
    email: user.email || "",
    contact: user.contact || "",
    role: user.role || "Employee",
    department: user.department?.name || user.departmentName || "",
    departmentId: user.department?.id || user.department?._id || "",
    location: user.houseAddress || user.address || "",
    status: normalizeStatus(user.status),
    dateofbirth: formatDob(user.dateOfBirth || user.dateofbirth),
  };
}

function extractUsersArray(data: unknown): ApiUser[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as ApiUser[];

  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of ["users", "data", "employees", "items"]) {
      if (Array.isArray(record[key])) {
        return record[key] as ApiUser[];
      }
    }
  }

  return [];
}

export default function EmployeeDataCards() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const fetchEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    setFetchError(null);

    try {
      const token = getToken();

      const res = await fetch(`${BASE_URL}/v1/users`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch employees");
      }

      const users = extractUsersArray(data);
      setEmployees(users.map((u, i) => mapApiUserToEmployee(u, i)));
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const token = getToken();

      const res = await fetch(`${BASE_URL}/v1/department`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json().catch(() => null);

      let raw: ApiDepartment[] = [];

      if (Array.isArray(data)) {
        raw = data;
      } else if (Array.isArray(data?.data)) {
        raw = data.data;
      }

      setDepartments(
        raw.map((d) => ({
          ...d,
          id: d.id || d._id || "",
        })),
      );
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      !searchQuery ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" || emp.departmentId === selectedDepartment;

    const matchesStatus =
      selectedStatus === "all" || emp.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departmentOptions = [
    { value: "all", label: "All Departments" },
    ...departments.map((d) => ({
      value: d.id || "",
      label: d.name || "Unnamed",
    })),
  ];

  return (
    <div className="m-2.5">
      <div className="mb-5 flex justify-between">
        <AddEmployeeForm
          onEmployeeCreated={(newEmployee) => {
            setEmployees((prev) => [
              {
                ...newEmployee,
                departmentId: "",
              },
              ...prev,
            ]);
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-2xl font-bold">{employees.length}</p>
          <p className="text-muted-foreground text-sm">Total Employees</p>
        </Card>

        <Card className="p-4">
          <p className="text-2xl font-bold text-emerald-700">
            {employees.filter((e) => e.status === "active").length}
          </p>
          <p className="text-muted-foreground text-sm">Active</p>
        </Card>

        <Card className="p-4">
          <p className="text-2xl font-bold text-red-600">
            {employees.filter((e) => e.status === "on-leave").length}
          </p>
          <p className="text-muted-foreground text-sm">On Leave</p>
        </Card>

        <Card className="p-4">
          <p className="text-2xl font-bold">{departments.length}</p>
          <p className="text-muted-foreground text-sm">Departments</p>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
          <Search className="size-4" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>

        <ResponsiveSelect
          value={selectedDepartment}
          onChange={setSelectedDepartment}
          options={departmentOptions}
        />

        <ResponsiveSelect
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={statusOptions}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loadingEmployees ? (
          <p className="col-span-full py-10 text-center">
            Loading employees...
          </p>
        ) : fetchError ? (
          <p className="col-span-full py-10 text-center text-red-500">
            {fetchError}
          </p>
        ) : filteredEmployees.length === 0 ? (
          <p className="col-span-full py-10 text-center">No employees found.</p>
        ) : (
          filteredEmployees.map((emp) => {
            const statusInfo =
              statusConfig[emp.status] || statusConfig.inactive;

            return (
              <Card key={`${emp.id}-${emp.email}`}>
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>{emp.avatar}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-semibold">{emp.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {emp.role}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>View Leave History</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2Icon className="mr-2 size-3.5" />
                          View Leave History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex gap-2">
                      <Building2 className="size-3.5" />
                      {emp.department}
                    </div>

                    <div className="flex gap-2">
                      <Mail className="size-3.5" />
                      {emp.email}
                    </div>

                    <div className="flex gap-2">
                      <MapPin className="size-3.5" />
                      {emp.location}
                    </div>

                    <div className="flex gap-2">
                      <Phone className="size-3.5" />
                      {emp.contact}
                    </div>

                    <div className="flex gap-2">
                      <Cake className="size-4" />
                      {emp.dateofbirth}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between">
                    <Badge className={statusInfo.className}>
                      {statusInfo.label}
                    </Badge>

                    <span className="text-muted-foreground text-[10px]">
                      {emp.id}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
