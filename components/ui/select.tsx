"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type ResponsiveSelectProps = {
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
};

export function ResponsiveSelect({
  placeholder = "Select an option",
  options,
  value,
  onChange,
}: ResponsiveSelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange}>
      {/* Trigger */}
      <SelectPrimitive.Trigger className="border-input bg-background focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none">
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      {/* Dropdown */}
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="bg-popover z-50 min-w-[200px] overflow-hidden rounded-md border shadow-md">
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="hover:bg-accent focus:bg-accent relative flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none select-none"
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>

                <SelectPrimitive.ItemIndicator className="absolute right-2">
                  <Check className="h-4 w-4" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
