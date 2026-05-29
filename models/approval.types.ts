export type ApprovalRequest = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  reason: string;
  totalDays?: number;
  conflict?: boolean;
  conflictDetails?: string;
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
  workflow?: {
    step: string;
    user: string;
    status: "completed" | "current" | "pending";
  }[];
};

export const APPROVAL_TYPE_COLORS: Record<string, string> = {
  Annual: "bg-blue-500/10 text-blue-600",
  Sick: "bg-red-500/10 text-red-600",
  Personal: "bg-purple-500/10 text-purple-600",
};

export const STEP_STATUS_COLORS: Record<string, string> = {
  completed: "bg-success text-success-foreground",
  current: "bg-primary text-primary-foreground",
  pending: "bg-muted text-muted-foreground",
};
