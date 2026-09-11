import { AdminAppShell, type AdminShellLabels } from "@/components/admin/app-shell";
import { getAdminUi, prefsToolbarLabels } from "@/lib/admin-ui";
import { getCsrfToken } from "@/lib/csrf";

function modeFromPref(pref: string | null | undefined): "light" | "dark" | "system" {
  if (pref === "light" || pref === "dark") return pref;
  return "system";
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  let colorMode: "system" | "light" | "dark" = "system";
  let localePref: "auto" | "zh-CN" | "en" = "auto";
  let siteName = "LinkBio";
  let csrf = "";
  let labels: AdminShellLabels = {
    overview: "Overview",
    profile: "Profile",
    links: "Links",
    theme: "Theme",
    data: "Data",
    publicSite: "Public site",
    logout: "Logout",
    menu: "Menu",
    close: "Close",
    appearance: "Appearance",
    color: "Color mode",
    system: "System",
    light: "Light",
    dark: "Dark",
    locale: "Language",
    auto: "Auto",
    zh: "中文",
    en: "English",
  };

  try {
    const ui = await getAdminUi();
    colorMode = ui.colorMode;
    localePref = ui.localePref;
    siteName = ui.siteName;
    csrf = await getCsrfToken();
    const tb = prefsToolbarLabels(ui.t);
    labels = {
      overview: ui.t("admin.nav.overview"),
      profile: ui.t("admin.nav.profile"),
      links: ui.t("admin.nav.links"),
      theme: ui.t("admin.nav.theme"),
      data: ui.t("admin.nav.data"),
      publicSite: ui.t("admin.nav.public"),
      logout: ui.t("admin.nav.logout"),
      menu: ui.t("admin.nav.menu"),
      close: ui.t("admin.nav.close"),
      appearance: ui.t("admin.nav.appearance"),
      color: tb.color,
      system: tb.system,
      light: tb.light,
      dark: tb.dark,
      locale: tb.locale,
      auto: tb.auto,
      zh: tb.zh,
      en: tb.en,
    };
  } catch {
    /* bindings unavailable during some tool paths */
  }

  const mode = modeFromPref(colorMode);

  return (
    <div className="admin-root" data-mode={mode === "system" ? undefined : mode} data-admin-root>
      {mode === "system" ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.querySelector('[data-admin-root]');if(!r)return;var d=window.matchMedia('(prefers-color-scheme: dark)').matches;r.setAttribute('data-mode',d?'dark':'light');}catch(e){}})();`,
          }}
        />
      ) : null}
      <AdminAppShell
        siteName={siteName}
        csrf={csrf}
        colorMode={colorMode}
        localePref={localePref}
        labels={labels}
      >
        {children}
      </AdminAppShell>
    </div>
  );
}
