"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Users,
} from "lucide-react";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="bg-primary/10 flex size-11 items-center justify-center rounded-xl">
            <CalendarDays className="text-primary size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-sm">Pending Requests</p>
            <div className="flex items-baseline gap-2">
              <p className="text-foreground text-2xl font-semibold">5</p>
              <Badge
                variant="secondary"
                className="bg-warning/15 text-warning-foreground border-0 text-[10px]"
              >
                <ArrowUpRight className="mr-0.5 size-3" />
                +2
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="bg-success/10 flex size-11 items-center justify-center rounded-xl">
            <CheckCircle2 className="text-success size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-sm">Approved (MTD)</p>
            <div className="flex items-baseline gap-2">
              <p className="text-foreground text-2xl font-semibold">9</p>
              <Badge
                variant="secondary"
                className="bg-success/15 text-success border-0 text-[10px]"
              >
                <TrendingUp className="mr-0.5 size-3" />
                94%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="bg-destructive/10 flex size-11 items-center justify-center rounded-xl">
            <Users className="text-destructive size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-sm">Out Today</p>
            <div className="flex items-baseline gap-2">
              <p className="text-foreground text-2xl font-semibold">3</p>
              <span className="text-muted-foreground text-xs">of 142</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="bg-warning/10 flex size-11 items-center justify-center rounded-xl">
            <AlertTriangle className="text-warning-foreground size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-sm">Conflicts</p>
            <div className="flex items-baseline gap-2">
              <p className="text-foreground text-2xl font-semibold">1</p>
              <span className="text-destructive text-xs font-medium">
                Needs review
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
