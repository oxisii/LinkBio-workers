import { LinkButton } from "@/components/base/button";
import { IconSelect } from "@/components/admin/icon-select";
import { Input } from "@/components/base/field";
import { SubmitButton } from "@/components/base/submit-button";
import { SwitchField } from "@/components/base/switch";
import { CSRF_FIELD } from "@/lib/security";
import type { LinkItem } from "@/lib/types";
import type { TranslateFn } from "@/lib/i18n";

export function LinkFields({
  csrf,
  t,
  item,
  submitLabel,
}: {
  csrf: string;
  t: TranslateFn;
  item?: LinkItem;
  submitLabel: string;
}) {
  return (
    <div className="space-y-4">
      <input type="hidden" name={CSRF_FIELD} value={csrf} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <Input
        id="title"
        name="title"
        label={t("admin.links.fieldTitle")}
        defaultValue={item?.title ?? ""}
        required
        maxLength={80}
      />
      <Input
        id="url"
        name="url"
        type="url"
        label={t("admin.links.url")}
        defaultValue={item?.url ?? ""}
        placeholder={t("admin.links.urlPlaceholder")}
        required
        maxLength={2000}
      />
      <IconSelect
        name="icon"
        label={t("admin.links.icon")}
        defaultValue={item?.icon ?? "link"}
        customLabelTemplate={t("admin.links.icon.custom")}
      />
      <SwitchField name="enabled" defaultChecked={item ? item.enabled : true}>
        {t("admin.links.enabled")}
      </SwitchField>
      <div className="admin-form-actions">
        <SubmitButton type="submit" variant="primary" pendingLabel={t("admin.common.saving")}>
          {submitLabel}
        </SubmitButton>
        <LinkButton href="/admin/links" variant="outline" size="md">
          {t("admin.links.cancelEdit")}
        </LinkButton>
      </div>
    </div>
  );
}
