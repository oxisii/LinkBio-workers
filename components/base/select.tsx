"use client";

import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { FieldDescription, FieldLabel, FieldRoot } from "./field";
import { cn } from "@/lib/utils";

export const SelectRoot = Select.Root;
export const SelectTrigger = Select.Trigger;
export const SelectValue = Select.Value;
export const SelectPortal = Select.Portal;
export const SelectPositioner = Select.Positioner;
export const SelectPopup = Select.Popup;
export const SelectList = Select.List;
export const SelectItem = Select.Item;
export const SelectItemText = Select.ItemText;
export const SelectItemIndicator = Select.ItemIndicator;
export const SelectIcon = Select.Icon;

export const selectTriggerClass = cn(
  "flex h-10 min-h-10 w-full items-center justify-between gap-2 rounded-[var(--admin-radius-control)]",
  "bg-admin-control px-3 text-sm font-medium text-admin-text ring-1 ring-admin-line",
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-admin-focus",
  "data-disabled:opacity-50",
);

export const selectPopupClass = cn(
  "z-[200] max-h-[min(18rem,var(--available-height))] origin-[var(--transform-origin)] overflow-auto",
  "rounded-[var(--admin-radius-control)] bg-admin-elevated p-1 shadow-lg ring-1 ring-admin-line",
  "transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0",
  "data-starting-style:scale-95 data-starting-style:opacity-0",
  "motion-reduce:transition-none",
);

export const selectItemClass = cn(
  "flex w-full cursor-default items-start gap-2.5 rounded-md px-2.5 py-2 text-left text-sm outline-none select-none",
  "data-highlighted:bg-admin-tint data-selected:bg-admin-tint data-selected:font-medium",
);

export type AdminSelectOption = {
  value: string;
  label: string;
  description?: string;
};

export function AdminSelect({
  id,
  name,
  label,
  defaultValue,
  options,
  description,
  className,
  placeholder,
}: {
  id?: string;
  name: string;
  label: string;
  defaultValue?: string;
  options: AdminSelectOption[];
  description?: string;
  className?: string;
  placeholder?: string;
}) {
  const initial =
    options.find((o) => o.value === defaultValue)?.value ?? options[0]?.value ?? "";

  return (
    <FieldRoot className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select.Root name={name} defaultValue={initial}>
        <Select.Trigger id={id} className={selectTriggerClass}>
          <Select.Value className="min-w-0 truncate" placeholder={placeholder} />
          <Select.Icon className="shrink-0 text-admin-muted">
            <ChevronDown className="size-4" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="outline-none" sideOffset={6} alignItemWithTrigger={false}>
            <Select.Popup className={selectPopupClass}>
              <Select.List>
                {options.map((opt) => (
                  <Select.Item key={opt.value} value={opt.value} className={selectItemClass}>
                    <span className="min-w-0 flex-1">
                      <Select.ItemText className="block truncate text-admin-text">
                        {opt.label}
                      </Select.ItemText>
                      {opt.description ? (
                        <span className="mt-0.5 block text-xs leading-snug text-admin-muted">
                          {opt.description}
                        </span>
                      ) : null}
                    </span>
                    <Select.ItemIndicator className="mt-0.5 shrink-0 text-admin-strong">
                      <Check className="size-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </FieldRoot>
  );
}
