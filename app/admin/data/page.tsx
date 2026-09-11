import { redirect } from "next/navigation";
import { Button, LinkButton } from "@/components/base/button";
import { Input, InputArea } from "@/components/base/field";
import { SubmitButton } from "@/components/base/submit-button";
import { SwitchField } from "@/components/base/switch";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";
import {
  importDataAction,
  restoreGistAction,
  restoreWebDavAction,
  runBackupNowAction,
  saveBackupConfigAction,
} from "../actions";
import { AdminPageHeader, AdminSection } from "@/components/admin/app-shell";
import { Flash } from "@/components/admin/flash";
import { isAdminSession } from "@/lib/auth";
import { getAdminUi } from "@/lib/admin-ui";
import {
  translateBackupError,
  translateBackupSource,
  translateBackupTarget,
} from "@/lib/backup-i18n";
import { getCsrfToken } from "@/lib/csrf";
import { resolveAdminFlash } from "@/lib/flash";
import { CSRF_FIELD } from "@/lib/security";

export const dynamic = "force-dynamic";

export default async function DataPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  if (!(await isAdminSession())) redirect("/admin/login");
  const { store, t } = await getAdminUi();
  const [backup, state] = await Promise.all([store.getBackupConfig(), store.getBackupState()]);
  const csrf = await getCsrfToken();
  const sp = await searchParams;
  const flash = await resolveAdminFlash(sp.msg);

  const statusLine = state.lastAttemptAt
    ? [
        state.lastOk ? t("admin.backup.statusOk") : t("admin.backup.statusFail"),
        state.lastSource
          ? `${t("admin.backup.source")}: ${translateBackupSource(t, state.lastSource)}`
          : "",
        state.lastTargets.length
          ? `${t("admin.backup.targets")}: ${state.lastTargets
              .map((x) => translateBackupTarget(t, x))
              .join(", ")}`
          : "",
        state.lastSuccessAt
          ? `${t("admin.backup.lastSuccess")}: ${state.lastSuccessAt}`
          : "",
        state.lastAttemptAt
          ? `${t("admin.backup.lastAttempt")}: ${state.lastAttemptAt}`
          : "",
        state.lastError
          ? `${t("admin.backup.lastError")}: ${translateBackupError(t, state.lastError)}`
          : "",
      ]
        .filter(Boolean)
        .join(" · ")
    : t("admin.backup.statusNone");

  return (
    <>
      <AdminPageHeader title={t("admin.page.data")} description={t("admin.data.subtitle")} />
      <Flash message={flash} />

      <AdminSection className="mb-6" title={t("admin.data.title")} description={t("admin.data.hint")}>
        <div className="space-y-4">
          <LinkButton href="/api/admin/export" variant="secondary">
            {t("admin.data.export")}
          </LinkButton>
          <form action={importDataAction} className="space-y-3">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />
            <InputArea
              id="json"
              name="json"
              label={t("admin.data.importLabel")}
              required
              rows={8}
              className="font-mono text-xs"
              placeholder={t("admin.data.importPlaceholder")}
            />
            <ConfirmSubmitButton
              type="submit"
              variant="destructive"
              confirmTitle={t("admin.data.import")}
              confirmMessage={t("admin.data.importConfirm")}
              confirmLabel={t("admin.common.confirm")}
              cancelLabel={t("admin.common.cancel")}
            >
              {t("admin.data.import")}
            </ConfirmSubmitButton>
          </form>
        </div>
      </AdminSection>

      <AdminSection
        className="mb-6"
        title={t("admin.backup.title")}
        description={t("admin.backup.hint")}
      >
        <div className="space-y-4">
          <p className="rounded-lg bg-admin-tint px-3 py-2 text-xs text-admin-text">{statusLine}</p>

          <form action={saveBackupConfigAction} className="space-y-5">
            <input type="hidden" name={CSRF_FIELD} value={csrf} />

            <div className="space-y-2">
              <SwitchField name="autoBackup" defaultChecked={backup.autoBackup}>
                {t("admin.backup.autoBackup")}
              </SwitchField>
              <SwitchField name="includeAnalytics" defaultChecked={backup.includeAnalytics}>
                {t("admin.backup.includeAnalytics")}
              </SwitchField>
              <Input
                id="minIntervalSec"
                name="minIntervalSec"
                type="number"
                label={t("admin.backup.minInterval")}
                defaultValue={String(backup.minIntervalSec)}
                min={60}
                max={604800}
                description={t("admin.backup.minIntervalHint")}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-admin-strong">{t("admin.backup.webdav")}</h3>
              <SwitchField name="webdavEnabled" defaultChecked={backup.webdav.enabled}>
                {t("admin.backup.webdavEnable")}
              </SwitchField>
              <Input
                id="webdavUrl"
                name="webdavUrl"
                type="url"
                label={t("admin.backup.webdavUrl")}
                defaultValue={backup.webdav.url}
                placeholder={t("admin.backup.webdavUrlPlaceholder")}
                required={false}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  id="webdavUsername"
                  name="webdavUsername"
                  label={t("admin.backup.webdavUser")}
                  defaultValue={backup.webdav.username}
                  required={false}
                  autoComplete="off"
                />
                <Input
                  id="webdavPassword"
                  name="webdavPassword"
                  type="password"
                  label={t("admin.backup.webdavPass")}
                  placeholder={
                    backup.webdav.password ? t("admin.backup.secretPlaceholder") : ""
                  }
                  description={t("admin.backup.secretKeep")}
                  required={false}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-admin-strong">{t("admin.backup.gist")}</h3>
              <SwitchField name="gistEnabled" defaultChecked={backup.gist.enabled}>
                {t("admin.backup.gistEnable")}
              </SwitchField>
              <Input
                id="gistToken"
                name="gistToken"
                type="password"
                label={t("admin.backup.gistToken")}
                placeholder={
                  backup.gist.token
                    ? t("admin.backup.secretPlaceholder")
                    : t("admin.backup.gistTokenPlaceholder")
                }
                description={t("admin.backup.secretKeep")}
                required={false}
                autoComplete="new-password"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  id="gistId"
                  name="gistId"
                  label={t("admin.backup.gistId")}
                  defaultValue={backup.gist.gistId}
                  description={t("admin.backup.gistIdHint")}
                  required={false}
                />
                <Input
                  id="gistFilename"
                  name="gistFilename"
                  label={t("admin.backup.gistFilename")}
                  defaultValue={backup.gist.filename}
                  required={false}
                />
              </div>
            </div>

            <SubmitButton type="submit" variant="primary" pendingLabel={t("admin.common.saving")}>
              {t("admin.backup.saveConfig")}
            </SubmitButton>
          </form>

          <div className="flex flex-wrap gap-2 border-t border-admin-border pt-4">
            <form action={runBackupNowAction}>
              <input type="hidden" name={CSRF_FIELD} value={csrf} />
              <Button type="submit" variant="secondary">
                {t("admin.backup.runNow")}
              </Button>
            </form>
            <form action={restoreWebDavAction}>
              <input type="hidden" name={CSRF_FIELD} value={csrf} />
              <ConfirmSubmitButton
                type="submit"
                variant="destructive"
                confirmTitle={t("admin.backup.restoreWebdav")}
                confirmMessage={t("admin.backup.restoreWarn")}
                confirmLabel={t("admin.common.confirm")}
                cancelLabel={t("admin.common.cancel")}
              >
                {t("admin.backup.restoreWebdav")}
              </ConfirmSubmitButton>
            </form>
            <form action={restoreGistAction}>
              <input type="hidden" name={CSRF_FIELD} value={csrf} />
              <ConfirmSubmitButton
                type="submit"
                variant="destructive"
                confirmTitle={t("admin.backup.restoreGist")}
                confirmMessage={t("admin.backup.restoreWarn")}
                confirmLabel={t("admin.common.confirm")}
                cancelLabel={t("admin.common.cancel")}
              >
                {t("admin.backup.restoreGist")}
              </ConfirmSubmitButton>
            </form>
          </div>
          <p className="text-xs text-admin-muted">{t("admin.backup.restoreWarn")}</p>
        </div>
      </AdminSection>
    </>
  );
}
