"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full",
        "bg-admin-control ring-1 ring-admin-line",
        "transition-colors",
        "data-checked:bg-admin-primary data-checked:ring-admin-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-focus",
        "disabled:opacity-50",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        className={cn(
          "block size-4 translate-x-1 rounded-full bg-admin-text shadow-sm",
          "transition-transform data-checked:translate-x-5 data-checked:bg-admin-primary-fg",
          "motion-reduce:transition-none",
        )}
      />
    </BaseSwitch.Root>
  );
}

export function SwitchField({
  name,
  value = "1",
  defaultChecked,
  children,
  className,
}: {
  name: string;
  value?: string;
  defaultChecked?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex min-h-11 items-center justify-between gap-3 text-sm text-admin-text", className)}>
      <span className="min-w-0">{children}</span>
      <Switch name={name} value={value} defaultChecked={defaultChecked} />
    </label>
  );
}
