"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Database,
  ExternalLink,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Palette,
  Sun,
  User,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import {
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/base/menu";
import { CSRF_FIELD } from "@/lib/security";
import {
  COLOR_COOKIE,
  COLOR_STORAGE_KEY,
  LOCALE_COOKIE,
  type LocalePref,
} from "@/lib/prefs";
import type { ColorMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export type AdminShellLabels = {
  overview: string;
  profile: string;
  links: string;
  theme: string;
  data: string;
  publicSite: string;
  logout: string;
  menu: string;
  close: string;
  appearance: string;
  color: string;
  system: string;
  light: string;
  dark: string;
  locale: string;
  auto: string;
  zh: string;
  en: string;
};

const YEAR = 31536000;

const NAV = [
  { href: "/admin", key: "overview" as const, icon: LayoutDashboard, match: (p: string) => p === "/admin" },
  { href: "/admin/profile", key: "profile" as const, icon: User, match: (p: string) => p.startsWith("/admin/profile") },
  { href: "/admin/links", key: "links" as const, icon: Link2, match: (p: string) => p.startsWith("/admin/links") },
  { href: "/admin/theme", key: "theme" as const, icon: Palette, match: (p: string) => p.startsWith("/admin/theme") },
  { href: "/admin/data", key: "data" as const, icon: Database, match: (p: string) => p.startsWith("/admin/data") },
];

function setCookie(name: string, value: string) {
  const secure = typeof location !== "undefined" && location.protocol === "https:";
  let s = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${YEAR}; SameSite=Lax`;
  if (secure) s += "; Secure";
  document.cookie = s;
}

function applyColor(mode: ColorMode) {
  document.documentElement.setAttribute("data-theme", mode);
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.classList.toggle("light", mode === "light");
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute("content", mode === "system" ? "light dark" : mode);

  const root = document.querySelector<HTMLElement>("[data-admin-root]");
  if (root) {
    if (mode === "system") {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-mode", dark ? "dark" : "light");
    } else {
      root.setAttribute("data-mode", mode);
    }
  }

  try {
    localStorage.setItem(COLOR_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  setCookie(COLOR_COOKIE, mode);
}

export function AdminAppShell({
  children,
  siteName,
  csrf,
  colorMode,
  localePref,
  labels,
}: {
  children: React.ReactNode;
  siteName: string;
  csrf: string;
  colorMode: ColorMode;
  localePref: LocalePref;
  labels: AdminShellLabels;
}) {
  const pathname = usePathname() || "/admin";
  const isLogin = pathname.startsWith("/admin/login");
  const [open, setOpen] = useState(false);
  const logoutRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (isLogin) {
    return <div className="admin-login-frame">{children}</div>;
  }

  const colorLabel =
    colorMode === "light" ? labels.light : colorMode === "dark" ? labels.dark : labels.system;
  const localeLabel =
    localePref === "zh-CN" ? labels.zh : localePref === "en" ? labels.en : labels.auto;
  const ColorIcon = colorMode === "light" ? Sun : colorMode === "dark" ? Moon : Monitor;

  return (
    <div className="admin-app">
      {open ? (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label={labels.close}
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className={cn("admin-sidebar", open && "is-open")} aria-label={siteName}>
        <div className="admin-sidebar-brand">
          <Link href="/admin" className="admin-sidebar-logo" onClick={() => setOpen(false)}>
            <span className="truncate">{siteName}</span>
          </Link>
          <button
            type="button"
            className="admin-icon-btn md:hidden"
            aria-label={labels.close}
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("admin-sidebar-link", active && "is-active")}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon className="size-4 shrink-0" />
                <span>{labels[item.key]}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar-link">
            <ExternalLink className="size-4 shrink-0" />
            <span>{labels.publicSite}</span>
          </Link>

          <MenuRoot>
            <MenuTrigger
              render={
                <button type="button" className="admin-sidebar-link admin-sidebar-account" />
              }
            >
              <ColorIcon className="size-4 shrink-0" />
              <span className="min-w-0 truncate">
                {labels.appearance}
                <span className="mt-0.5 block text-[11px] font-normal text-admin-muted">
                  {colorLabel} · {localeLabel}
                </span>
              </span>
            </MenuTrigger>
            <MenuPortal>
              <MenuPositioner side="top" align="start" sideOffset={8}>
                <MenuPopup>
                  <MenuGroup>
                    <MenuLabel>{labels.color}</MenuLabel>
                    <MenuSeparator className="my-1 h-px bg-admin-line" />
                    {(
                      [
                        ["system", labels.system],
                        ["light", labels.light],
                        ["dark", labels.dark],
                      ] as const
                    ).map(([value, label]) => (
                      <MenuItem
                        key={value}
                        className={cn(colorMode === value && "font-semibold")}
                        onClick={() => {
                          applyColor(value);
                          router.refresh();
                        }}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </MenuGroup>
                  <MenuSeparator className="my-1 h-px bg-admin-line" />
                  <MenuGroup>
                    <MenuLabel>{labels.locale}</MenuLabel>
                    <MenuSeparator className="my-1 h-px bg-admin-line" />
                    {(
                      [
                        ["auto", labels.auto],
                        ["zh-CN", labels.zh],
                        ["en", labels.en],
                      ] as const
                    ).map(([value, label]) => (
                      <MenuItem
                        key={value}
                        className={cn(localePref === value && "font-semibold")}
                        onClick={() => {
                          setCookie(LOCALE_COOKIE, value);
                          router.refresh();
                        }}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </MenuGroup>
                </MenuPopup>
              </MenuPositioner>
            </MenuPortal>
          </MenuRoot>

          <button
            type="button"
            className="admin-sidebar-link text-admin-danger"
            onClick={() => logoutRef.current?.requestSubmit()}
          >
            <LogOut className="size-4 shrink-0" />
            <span>{labels.logout}</span>
          </button>

          <form ref={logoutRef} action={logoutAction} className="hidden">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
          </form>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-mobile-bar">
          <button
            type="button"
            className="admin-icon-btn"
            aria-label={labels.menu}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-4" />
          </button>
          <span className="truncate text-sm font-semibold text-admin-strong">{siteName}</span>
          <span className="w-9" />
        </header>
        <div className="admin-main-inner">{children}</div>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="admin-page-header">
      <div className="min-w-0">
        <h1 className="text-[1.65rem] font-semibold tracking-tight text-admin-strong">{title}</h1>
        {description ? <p className="mt-1 text-sm text-admin-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function AdminSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("admin-section", className)}>
      {title ? (
        <div className="admin-section-head">
          <h2 className="text-sm font-semibold text-admin-strong">{title}</h2>
          {description ? <p className="text-xs text-admin-muted">{description}</p> : null}
        </div>
      ) : null}
      <div className="admin-section-body">{children}</div>
    </section>
  );
}
