"use client";

import * as React from "react";
import Link from "next/link";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "destructive" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-admin-primary text-admin-primary-fg shadow-sm hover:opacity-90",
  secondary: "bg-admin-control text-admin-text ring-1 ring-admin-line hover:bg-admin-tint",
  destructive: "bg-admin-danger text-white shadow-sm hover:opacity-90",
  outline: "bg-transparent text-admin-text ring-1 ring-admin-line hover:bg-admin-tint",
  ghost: "bg-transparent text-admin-text hover:bg-admin-tint",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 min-h-9 gap-1.5 px-2.5 text-sm",
  md: "h-10 min-h-10 gap-2 px-3.5 text-sm",
  lg: "h-11 min-h-11 gap-2 px-4 text-base",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-[var(--admin-radius-control)] font-medium",
    "transition-colors select-none motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-focus",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&[data-disabled]]:pointer-events-none [&[data-disabled]]:opacity-50",
    variantClass[variant],
    sizeClass[size],
    className,
  );
}

export type ButtonProps = Omit<React.ComponentProps<typeof BaseButton>, "className" | "ref"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type, ...props },
  ref,
) {
  return (
    <BaseButton
      ref={ref}
      type={type ?? "button"}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
});

type LinkButtonProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** Styled link — never compose Base UI Button onto <a>. */
export function LinkButton({
  href,
  className,
  variant = "secondary",
  size = "md",
  ...props
}: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClassName({ variant, size, className })} {...props} />
  );
}
