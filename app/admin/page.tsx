import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/app-shell";
import { isAdminSession } from "@/lib/auth";
import { getAdminUi } from "@/lib/admin-ui";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { store, t } = await getAdminUi();
  const [profile, links, analytics] = await Promise.all([
    store.getProfile(),
    store.getLinks(),
    store.getAnalytics(),
  ]);
  const clicks = Object.values(analytics.linkClicks).reduce((a, b) => a + b, 0);
  const enabled = links.filter((l) => l.enabled).length;

  return (
    <>
      <AdminPageHeader title={t("admin.page.overview")} description={t("admin.overview.subtitle")} />

      <div className="admin-kpi-grid">
        <div className="admin-kpi">
          <p className="text-sm text-admin-muted">{t("admin.stats.pageViews")}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-admin-strong">
            {analytics.pageViews}
          </p>
        </div>
        <div className="admin-kpi">
          <p className="text-sm text-admin-muted">{t("admin.stats.linkClicks")}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-admin-strong">{clicks}</p>
        </div>
        <div className="admin-kpi">
          <p className="text-sm text-admin-muted">{t("admin.stats.lastUpdated")}</p>
          <p className="mt-2 text-sm font-medium text-admin-text">
            {analytics.lastUpdated || t("admin.stats.empty")}
          </p>
        </div>
      </div>

      <section className="admin-list">
        <div className="admin-list-row">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-admin-strong">{profile.name || t("admin.stats.empty")}</p>
            <p className="truncate text-sm text-admin-muted">
              {profile.username ? `@${profile.username}` : t("admin.overview.currentProfile")}
              {" · "}
              {t("admin.overview.enabledLinks", { count: enabled })}
            </p>
          </div>
        </div>
        {profile.bio ? (
          <div className="admin-list-row">
            <p className="text-sm text-admin-muted">{profile.bio}</p>
          </div>
        ) : null}
      </section>
      <p className="mt-3 text-xs text-admin-muted">{t("admin.stats.hint")}</p>
    </>
  );
}
