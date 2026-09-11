"use client";

import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

export const MenuRoot = Menu.Root;
export const MenuTrigger = Menu.Trigger;
export const MenuPortal = Menu.Portal;
export const MenuPositioner = Menu.Positioner;
export const MenuGroup = Menu.Group;
export const MenuGroupLabel = Menu.GroupLabel;
export const MenuSeparator = Menu.Separator;

export function MenuPopup({ className, ...props }: React.ComponentProps<typeof Menu.Popup>) {
  return (
    <Menu.Popup
      className={cn(
        "z-[70] min-w-[9.5rem] origin-[var(--transform-origin)] rounded-[var(--admin-radius-control)]",
        "bg-admin-elevated p-1 text-admin-text shadow-lg ring-1 ring-admin-line",
        "transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export function MenuItem({ className, ...props }: React.ComponentProps<typeof Menu.Item>) {
  return (
    <Menu.Item
      className={cn(
        "flex cursor-default items-center rounded-md px-2.5 py-1.5 text-sm outline-none select-none",
        "data-highlighted:bg-admin-tint data-highlighted:text-admin-strong",
        className,
      )}
      {...props}
    />
  );
}

export function MenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof Menu.GroupLabel>) {
  return (
    <Menu.GroupLabel
      className={cn("px-2.5 py-1.5 text-xs font-medium text-admin-muted", className)}
      {...props}
    />
  );
}
