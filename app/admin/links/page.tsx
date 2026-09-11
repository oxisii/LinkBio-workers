import Link from "next/link";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/base/button";
import { LinkRowActions } from "@/components/admin/link-row-actions";
import { AdminPageHeader } from "@/components/admin/app-shell";
import { Flash } from "@/components/admin/flash";
import { isAdminSession } from "@/lib/auth";
import { getAdminUi } from "@/lib/admin-ui";
import { getCsrfToken } from "@/lib/csrf";
import { resolveAdminFlash } from "@/lib/flash";
import { resolveLinkIconSrc } from "@/lib/icons";

export const dynamic = "force-dynamic";

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { store, t } = await getAdminUi();
  const links = await store.getLinks();
  const csrf = await getCsrfToken();
  const sp = await searchParams;
  const flash = await resolveAdminFlash(sp.msg);
  const sorted = [...links].sort((a, b) => a.order - b.order);

  const rowLabels = {
    more: t("admin.links.more"),
    edit: t("admin.links.edit"),
    enable: t("admin.links.enable"),
    disable: t("admin.links.disable"),
    moveUp: t("admin.links.moveUp"),
    moveDown: t("admin.links.moveDown"),
    delete: t("admin.links.delete"),
    deleteConfirm: t("admin.links.deleteConfirm"),
    confirm: t("admin.common.confirm"),
    cancel: t("admin.common.cancel"),
  };

  return (
    <>
      <AdminPageHeader
        title={t("admin.page.links")}
        description={t("admin.links.subtitle")}
        actions={
          <LinkButton href="/admin/links/new" variant="primary" size="sm">
            {t("admin.links.add")}
          </LinkButton>
        }
      />
      <Flash message={flash} />
      {sorted.length === 0 ? (
        <section className="admin-list">
          <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
            <p className="text-sm text-admin-muted">{t("admin.links.empty")}</p>
            <LinkButton href="/admin/links/new" variant="primary" size="sm">
              {t("admin.links.add")}
            </LinkButton>
          </div>
        </section>
      ) : (
        <section className="admin-list">
          {sorted.map((l, i) => {
            const iconSrc = resolveLinkIconSrc(l.icon);
            return (
              <div key={l.id} className="admin-list-row">
                <span
                  aria-hidden
                  className="inline-block size-8 shrink-0 rounded-md bg-admin-text"
                  style={{
                    maskImage: `url(${iconSrc})`,
                    WebkitMaskImage: `url(${iconSrc})`,
                    maskSize: "1.15rem",
                    WebkitMaskSize: "1.15rem",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
                <Link href={`/admin/links/${l.id}`} className="min-w-0 flex-1 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-focus">
                  <p className="truncate font-medium text-admin-strong">
                    {l.title || t("admin.stats.empty")}
                  </p>
                  <p className="truncate text-sm text-admin-muted">{l.url}</p>
                </Link>
                <LinkRowActions
                  id={l.id}
                  enabled={l.enabled}
                  isFirst={i === 0}
                  isLast={i === sorted.length - 1}
                  csrf={csrf}
                  labels={rowLabels}
                />
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}
