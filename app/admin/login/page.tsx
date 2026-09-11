import { redirect } from "next/navigation";
import { Input } from "@/components/base/field";
import { SubmitButton } from "@/components/base/submit-button";
import { loginAction } from "../actions";
import { Flash } from "@/components/admin/flash";
import { isAdminSession } from "@/lib/auth";
import { getAdminUi } from "@/lib/admin-ui";
import { getCsrfToken } from "@/lib/csrf";
import { resolveAdminFlash } from "@/lib/flash";
import { CSRF_FIELD } from "@/lib/security";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (await isAdminSession()) redirect("/admin");
  const { t, siteName } = await getAdminUi();
  const csrf = await getCsrfToken();
  const sp = await searchParams;
  const flash = await resolveAdminFlash(sp.msg);

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-admin-strong">
        {t("admin.login.heading")}
      </h1>
      <p className="mt-1 text-sm text-admin-muted">{t("admin.login.sub", { siteName })}</p>
      <div className="mt-8">
        <Flash message={flash} />
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name={CSRF_FIELD} value={csrf} />
          <Input
            id="password"
            name="password"
            type="password"
            label={t("admin.login.password")}
            required
            autoComplete="current-password"
            autoFocus
          />
          <SubmitButton
            type="submit"
            variant="primary"
            className="w-full"
            pendingLabel={t("admin.common.saving")}
          >
            {t("admin.login.submit")}
          </SubmitButton>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-admin-muted hover:text-admin-text">
            {t("admin.login.back")}
          </Link>
        </p>
      </div>
    </div>
  );
}
