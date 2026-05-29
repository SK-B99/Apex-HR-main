export type LeaveRequest = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  reason: string;
  totalDays?: number;
  user?: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  leavePolicy?: {
    id: string;
    name: string;
    type: string;
  };
};

export type LeaveRequestFormState = {
  leavePolicyId: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  reason: string;
};

export const EMPTY_LEAVE_REQUEST_FORM: LeaveRequestFormState = {
  leavePolicyId: "",
  departmentId: "",
  startDate: "",
  endDate: "",
  isHalfDay: false,
  reason: "",
};

export const STATUS_CONFIG: Record<
  string,
  { label: string; icon: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    icon: "Clock",
    className: "bg-warning/15 text-warning-foreground border-0",
  },
  DEPT_APPROVED: {
    label: "Dept Approved",
    icon: "CheckCircle2",
    className: "bg-blue-500/15 text-blue-600 border-0",
  },
  APPROVED: {
    label: "Approved",
    icon: "CheckCircle2",
    className: "bg-success/15 text-success border-0",
  },
  REJECTED: {
    label: "Rejected",
    icon: "XCircle",
    className: "bg-destructive/15 text-destructive border-0",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: "XCircle",
    className: "bg-muted text-muted-foreground border-0",
  },
};

export const TYPE_COLORS: Record<string, string> = {
  Annual: "bg-chart-1/10 text-chart-1",
  Sick: "bg-chart-2/10 text-chart-2",
  Personal: "bg-chart-3/10 text-chart-3",
  Unpaid: "bg-muted text-muted-foreground",
  Parental: "bg-chart-4/10 text-chart-4",
};
