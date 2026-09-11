import { redirect } from "next/navigation";
import { Input, InputArea } from "@/components/base/field";
import { SubmitButton } from "@/components/base/submit-button";
import { SwitchField } from "@/components/base/switch";
import { saveSettingsAction } from "../actions";
import { AdminSelect } from "@/components/admin/admin-select";
import { AdminPageHeader, AdminSection } from "@/components/admin/app-shell";
import { Flash } from "@/components/admin/flash";
import { isAdminSession } from "@/lib/auth";
import { getAdminUi } from "@/lib/admin-ui";
import { getCsrfToken } from "@/lib/csrf";
import { resolveAdminFlash } from "@/lib/flash";
import { themeDescription } from "@/lib/i18n";
import { CSRF_FIELD } from "@/lib/security";
import { listThemes, resolveThemeId } from "@/lib/themes";

export const dynamic = "force-dynamic";

const PREVIEW: Record<string, { a: string; b: string; c: string }> = {
  aurora: { a: "hsl(232 78% 58%)", b: "hsl(175 55% 55%)", c: "hsl(230 40% 96%)" },
  base: { a: "hsl(232 78% 58%)", b: "hsl(175 55% 55%)", c: "hsl(230 40% 96%)" },
  minimal: { a: "hsl(0 0% 18%)", b: "hsl(0 0% 60%)", c: "hsl(0 0% 96%)" },
  anthropic: { a: "#D97757", b: "#E3DACC", c: "#FAF9F5" },
  "liquid-glass": { a: "#0A84FF", b: "#E8F1FA", c: "#FFFFFF" },
  md3: { a: "#6750A4", b: "#F3EDF7", c: "#FEF7FF" },
  nodeseek: { a: "#0B6E99", b: "#E8F2F6", c: "#FFFFFF" },
  qtcool: { a: "#007AFF", b: "#F7F1E3", c: "#1a1a1a" },
  xandroid: { a: "#1D9BF0", b: "#0f1419", c: "#FFFFFF" },
  firecrawl: { a: "#FF5A1F", b: "#050505", c: "#1a1a1a" },
};

export default async function ThemePage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { store, env, settings, t, locale } = await getAdminUi();
  const csrf = await getCsrfToken();
  const sp = await searchParams;
  const flash = await resolveAdminFlash(sp.msg);
  const themes = listThemes();
  const currentThemeId = resolveThemeId(settings.theme, env.DEFAULT_THEME);
  const localeZh = locale === "zh-CN";
  const siteDefault = env.DEFAULT_THEME || "minimal";

  return (
    <>
      <AdminPageHeader title={t("admin.page.theme")} description={t("admin.theme.subtitle")} />
      <Flash message={flash} />
      <form action={saveSettingsAction} className="space-y-6">
        <input type="hidden" name={CSRF_FIELD} value={csrf} />

        <AdminSection
          title={t("admin.theme.theme")}
          description={t("admin.theme.defaultThemeHint", {
            default: siteDefault,
            current: currentThemeId,
          })}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {themes.map((th) => {
              const sw = PREVIEW[th.id] || PREVIEW.aurora!;
              const title = localeZh ? th.nameZh : th.name;
              const desc = themeDescription(t, th.id, th.description);
              return (
                <label key={th.id} className="admin-theme-card">
                  <input
                    type="radio"
                    name="theme"
                    value={th.id}
                    defaultChecked={currentThemeId === th.id}
                    className="sr-only"
                  />
                  <div className="mb-2 flex h-10 gap-1 overflow-hidden rounded-md">
                    <span className="flex-1" style={{ background: sw.a }} />
                    <span className="flex-1" style={{ background: sw.b }} />
                    <span className="flex-1" style={{ background: sw.c }} />
                  </div>
                  <div className="text-sm font-medium text-admin-text">
                    {title}{" "}
                    <span className="font-mono text-xs font-normal text-admin-muted">({th.id})</span>
                  </div>
                  {desc ? <p className="mt-0.5 line-clamp-2 text-xs text-admin-muted">{desc}</p> : null}
                </label>
              );
            })}
          </div>
        </AdminSection>

        <AdminSection title={t("admin.theme.colorMode")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminSelect
              id="colorMode"
              name="colorMode"
              label={t("admin.theme.colorMode")}
              defaultValue={settings.colorMode}
              options={[
                { value: "system", label: t("admin.theme.colorMode.system") },
                { value: "light", label: t("admin.theme.colorMode.light") },
                { value: "dark", label: t("admin.theme.colorMode.dark") },
              ]}
            />
            <AdminSelect
              id="locale"
              name="locale"
              label={t("admin.theme.locale")}
              defaultValue={settings.locale}
              options={[
                { value: "zh-CN", label: t("admin.theme.locale.zhCN") },
                { value: "en", label: t("admin.theme.locale.en") },
              ]}
            />
          </div>
        </AdminSection>

        <AdminSection
          title={t("admin.theme.themeColorMode")}
          description={t("admin.theme.customColorHint")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminSelect
              id="themeColorMode"
              name="themeColorMode"
              label={t("admin.theme.themeColorMode")}
              defaultValue={settings.themeColorMode}
              options={[
                { value: "default", label: t("admin.theme.themeColorMode.default") },
                { value: "system", label: t("admin.theme.themeColorMode.system") },
                { value: "custom", label: t("admin.theme.themeColorMode.custom") },
              ]}
            />
            <Input
              id="customColor"
              name="customColor"
              label={t("admin.theme.customColor")}
              defaultValue={settings.customColor}
              pattern="#[0-9a-fA-F]{3,8}"
              placeholder={t("admin.theme.accentPlaceholder")}
              required={false}
            />
            <Input
              id="accentColor"
              name="accentColor"
              label={t("admin.theme.accent")}
              defaultValue={settings.accentColor}
              pattern="#[0-9a-fA-F]{3,8}"
              placeholder={t("admin.theme.accentPlaceholder")}
              required={false}
            />
            <Input
              id="background"
              name="background"
              type="url"
              label={t("admin.theme.background")}
              defaultValue={settings.background}
              placeholder={t("admin.theme.backgroundPlaceholder")}
              required={false}
            />
          </div>
        </AdminSection>

        <AdminSection title={t("admin.theme.footerTitle")} description={t("admin.theme.footerHint")}>
          <div className="space-y-4">
            <SwitchField
              name="showFooter"
              defaultChecked={settings.showFooter && settings.footerMode !== "off"}
            >
              {t("admin.theme.showFooter")}
            </SwitchField>
            <AdminSelect
              id="footerMode"
              name="footerMode"
              label={t("admin.theme.footerMode")}
              defaultValue={settings.footerMode}
              options={[
                { value: "default", label: t("admin.theme.footerMode.default") },
                { value: "custom", label: t("admin.theme.footerMode.custom") },
                { value: "auth_only", label: t("admin.theme.footerMode.auth_only") },
                { value: "off", label: t("admin.theme.footerMode.off") },
              ]}
            />
            <InputArea
              id="footerText"
              name="footerText"
              label={t("admin.theme.footerText")}
              defaultValue={settings.footerText}
              maxLength={500}
              placeholder={t("admin.theme.footerTextPlaceholder")}
              description={t("admin.theme.footerTextHint")}
              rows={3}
              required={false}
            />
          </div>
        </AdminSection>

        <div className="admin-form-actions">
          <SubmitButton type="submit" variant="primary" pendingLabel={t("admin.common.saving")}>
            {t("admin.theme.save")}
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
