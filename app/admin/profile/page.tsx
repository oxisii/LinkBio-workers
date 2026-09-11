import { redirect } from "next/navigation";
import { Input, InputArea } from "@/components/base/field";
import { SubmitButton } from "@/components/base/submit-button";
import { saveProfileAction } from "../actions";
import { AdminPageHeader, AdminSection } from "@/components/admin/app-shell";
import { Flash } from "@/components/admin/flash";
import { isAdminSession } from "@/lib/auth";
import { getAdminUi } from "@/lib/admin-ui";
import { getCsrfToken } from "@/lib/csrf";
import { resolveAdminFlash } from "@/lib/flash";
import { CSRF_FIELD } from "@/lib/security";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { store, t } = await getAdminUi();
  const profile = await store.getProfile();
  const csrf = await getCsrfToken();
  const sp = await searchParams;
  const flash = await resolveAdminFlash(sp.msg);

  return (
    <>
      <AdminPageHeader title={t("admin.page.profile")} description={t("admin.profile.subtitle")} />
      <Flash message={flash} />
      <AdminSection>
        <form action={saveProfileAction} className="space-y-4">
          <input type="hidden" name={CSRF_FIELD} value={csrf} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="name"
              name="name"
              label={t("admin.profile.name")}
              defaultValue={profile.name}
              required
              maxLength={80}
            />
            <Input
              id="username"
              name="username"
              label={t("admin.profile.username")}
              defaultValue={profile.username}
              maxLength={40}
            />
          </div>
          <InputArea
            id="bio"
            name="bio"
            label={t("admin.profile.bio")}
            defaultValue={profile.bio}
            maxLength={500}
            rows={4}
          />
          <Input
            id="avatar"
            name="avatar"
            type="url"
            label={t("admin.profile.avatar")}
            defaultValue={profile.avatar}
            maxLength={2000}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="location"
              name="location"
              label={t("admin.profile.location")}
              defaultValue={profile.location}
              maxLength={120}
            />
            <Input
              id="email"
              name="email"
              type="email"
              label={t("admin.profile.email")}
              defaultValue={profile.email}
              maxLength={120}
            />
          </div>
          <SubmitButton type="submit" variant="primary" pendingLabel={t("admin.common.saving")}>
            {t("admin.profile.save")}
          </SubmitButton>
        </form>
      </AdminSection>
    </>
  );
}
