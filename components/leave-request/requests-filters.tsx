import { Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { ResponsiveSelect } from "../ui/select";

const typeOptions = [
  { label: "Annual", value: "annual" },
  { label: "Sick", value: "sick" },
  { label: "Parental", value: "parental" },
];

const departmentOptions = [
  { label: "SAP", value: "sap" },
  { label: "Software", value: "software" },
  {
    label: "Educational Content Creation",
    value: "educational-content-creation",
  },
  { label: "HR", value: "hr" },
  { label: "Project Management", value: "project-management" },
  { label: "Corporate", value: "corporate" },
];

export default function RequestFilters() {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search by name or ID..."
              className="h-10 w-full pl-9"
            />
          </div>

          <div className="w-full sm:w-[160px]">
            <ResponsiveSelect placeholder="Leave type" options={typeOptions} />
          </div>

          <div className="w-full sm:w-[220px]">
            <ResponsiveSelect
              placeholder="Department"
              options={departmentOptions}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
