// components/people/employee-data-cards.tsx

"use client";

import { useMemo } from "react"; // ✅ useMemo instead of useEffect + useState
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
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import AddEmployeeForm from "./add-employee";
import NewDepartment from "./create-department";
import { useEmployeeViewModel } from "@/viewmodels/useEmployeeViewModel";
import { STATUS_OPTIONS, STATUS_CONFIG } from "@/models/employee.types";
import { getUserRole } from "@/lib/auth";

// ✅ Only TENANT_ADMIN and HR_ADMIN can manage employees and departments
const ADMIN_ROLES = ["TENANT_ADMIN", "HR_ADMIN"];

export default function EmployeeDataCards() {
  const vm = useEmployeeViewModel();

  // ✅ getUserRole() is synchronous (reads from localStorage + decodes JWT)
  // No async work here — useMemo is correct, no effect needed
  const canManage = useMemo(() => {
    const role = getUserRole();
    return ADMIN_ROLES.includes(role ?? "");
  }, []);

  return (
    <div className="m-2.5">
      {/* Department Header — Create Department button hidden for non-admins */}
      {canManage ? (
        <NewDepartment
          deptDialogOpen={vm.deptDialogOpen}
          deptForm={vm.deptForm}
          deptLoading={vm.deptLoading}
          deptError={vm.deptError}
          deptSuccess={vm.deptSuccess}
          setDeptField={vm.setDeptField}
          handleDeptOpenChange={vm.handleDeptOpenChange}
          handleCreateDepartment={vm.handleCreateDepartment}
        />
      ) : (
        // ✅ Non-admins still see the section heading, just no button
        <div>
          <h2 className="text-foreground text-lg font-semibold">Departments</h2>
          <p className="text-muted-foreground text-sm">
            Manage and organise your company departments
          </p>
        </div>
      )}

      {/* Add Employee — hidden for non-admins */}
      {canManage && (
        <div className="mt-4 mb-5 flex justify-between">
          <AddEmployeeForm
            employeeDialogOpen={vm.employeeDialogOpen}
            employeeForm={vm.employeeForm}
            employeeLoading={vm.employeeLoading}
            employeeError={vm.employeeError}
            employeeSuccess={vm.employeeSuccess}
            setEmployeeField={vm.setEmployeeField}
            setEmployeeDepartment={vm.setEmployeeDepartment}
            setEmployeeRole={vm.setEmployeeRole}
            handleEmployeeOpenChange={vm.handleEmployeeOpenChange}
            handleAddEmployee={vm.handleAddEmployee}
            departments={vm.departments}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-2xl font-bold">{vm.employees.length}</p>
          <p className="text-muted-foreground text-sm">Total Employees</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-emerald-700">
            {vm.employees.filter((e) => e.status === "active").length}
          </p>
          <p className="text-muted-foreground text-sm">Active</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold text-red-600">
            {vm.employees.filter((e) => e.status === "on-leave").length}
          </p>
          <p className="text-muted-foreground text-sm">On Leave</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-bold">{vm.departments.length}</p>
          <p className="text-muted-foreground text-sm">Departments</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
          <Search className="size-4" />
          <Input
            placeholder="Search employees..."
            value={vm.searchQuery}
            onChange={(e) => vm.setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>
        <ResponsiveSelect
          value={vm.selectedDepartment}
          onChange={vm.setSelectedDepartment}
          options={vm.departmentOptions}
        />
        <ResponsiveSelect
          value={vm.selectedStatus}
          onChange={vm.setSelectedStatus}
          options={STATUS_OPTIONS}
        />
      </div>

      {/* Employee Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vm.loadingEmployees ? (
          <p className="col-span-full py-10 text-center">
            Loading employees...
          </p>
        ) : vm.fetchError ? (
          <p className="col-span-full py-10 text-center text-red-500">
            {vm.fetchError}
          </p>
        ) : vm.filteredEmployees.length === 0 ? (
          <p className="col-span-full py-10 text-center">No employees found.</p>
        ) : (
          vm.filteredEmployees.map((emp) => {
            const statusInfo =
              STATUS_CONFIG[emp.status] || STATUS_CONFIG.inactive;
            return (
              // ✅ group class makes the hover dropdown trigger visible
              <Card key={`${emp.id}-${emp.email}`} className="group">
                <CardContent className="p-5">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>{emp.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
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
                        {/* ✅ Delete only shown to admins */}
                        {canManage && (
                          <DropdownMenuItem>
                            <Trash2Icon className="mr-2 size-3.5" />
                            Delete
                          </DropdownMenuItem>
                        )}
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
