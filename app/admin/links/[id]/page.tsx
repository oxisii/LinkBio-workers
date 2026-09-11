import { notFound, redirect } from "next/navigation";
import { updateLinkAction } from "../../actions";
import { AdminPageHeader, AdminSection } from "@/components/admin/app-shell";
import { Flash } from "@/components/admin/flash";
import { LinkFields } from "@/components/admin/link-form";
import { isAdminSession } from "@/lib/auth";
import { getAdminUi } from "@/lib/admin-ui";
import { getCsrfToken } from "@/lib/csrf";
import { resolveAdminFlash } from "@/lib/flash";

export const dynamic = "force-dynamic";

export default async function EditLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ msg?: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { id } = await params;
  const { store, t } = await getAdminUi();
  const links = await store.getLinks();
  const item = links.find((l) => l.id === id);
  if (!item) notFound();
  const csrf = await getCsrfToken();
  const flash = await resolveAdminFlash((await searchParams).msg);

  return (
    <>
      <AdminPageHeader title={t("admin.page.linksEdit")} description={item.title || item.url} />
      <Flash message={flash} />
      <AdminSection>
        <form action={updateLinkAction}>
          <LinkFields csrf={csrf} t={t} item={item} submitLabel={t("admin.links.saveEdit")} />
        </form>
      </AdminSection>
    </>
  );
}
