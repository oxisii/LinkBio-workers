import { redirect } from "next/navigation";
import { addLinkAction } from "../../actions";
import { AdminPageHeader, AdminSection } from "@/components/admin/app-shell";
import { Flash } from "@/components/admin/flash";
import { LinkFields } from "@/components/admin/link-form";
import { isAdminSession } from "@/lib/auth";
import { getAdminUi } from "@/lib/admin-ui";
import { getCsrfToken } from "@/lib/csrf";
import { resolveAdminFlash } from "@/lib/flash";

export const dynamic = "force-dynamic";

export default async function NewLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { t } = await getAdminUi();
  const csrf = await getCsrfToken();
  const flash = await resolveAdminFlash((await searchParams).msg);

  return (
    <>
      <AdminPageHeader title={t("admin.page.linksNew")} description={t("admin.links.subtitle")} />
      <Flash message={flash} />
      <AdminSection>
        <form action={addLinkAction}>
          <LinkFields csrf={csrf} t={t} submitLabel={t("admin.links.submit")} />
        </form>
      </AdminSection>
    </>
  );
}
