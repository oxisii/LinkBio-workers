"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { deleteLinkAction, reorderLinkAction, toggleLinkAction } from "@/app/admin/actions";
import { ConfirmDialog } from "@/components/base/dialog";
import { Switch } from "@/components/base/switch";
import {
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/base/menu";
import { CSRF_FIELD } from "@/lib/security";
import { cn } from "@/lib/utils";

export function LinkRowActions({
  id,
  enabled,
  isFirst,
  isLast,
  csrf,
  labels,
}: {
  id: string;
  enabled: boolean;
  isFirst: boolean;
  isLast: boolean;
  csrf: string;
  labels: {
    more: string;
    edit: string;
    enable: string;
    disable: string;
    moveUp: string;
    moveDown: string;
    delete: string;
    deleteConfirm: string;
    confirm: string;
    cancel: string;
  };
}) {
  const toggleRef = useRef<HTMLFormElement>(null);
  const upRef = useRef<HTMLFormElement>(null);
  const downRef = useRef<HTMLFormElement>(null);
  const deleteRef = useRef<HTMLFormElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex shrink-0 items-center gap-1">
      <form ref={toggleRef} action={toggleLinkAction} className="hidden">
        <input type="hidden" name={CSRF_FIELD} value={csrf} />
        <input type="hidden" name="id" value={id} />
      </form>
      <form ref={upRef} action={reorderLinkAction} className="hidden">
        <input type="hidden" name={CSRF_FIELD} value={csrf} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="dir" value="-1" />
      </form>
      <form ref={downRef} action={reorderLinkAction} className="hidden">
        <input type="hidden" name={CSRF_FIELD} value={csrf} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="dir" value="1" />
      </form>
      <form ref={deleteRef} action={deleteLinkAction} className="hidden">
        <input type="hidden" name={CSRF_FIELD} value={csrf} />
        <input type="hidden" name="id" value={id} />
      </form>

      <Switch
        checked={enabled}
        aria-label={enabled ? labels.disable : labels.enable}
        title={enabled ? labels.disable : labels.enable}
        onCheckedChange={() => toggleRef.current?.requestSubmit()}
      />

      <MenuRoot>
        <MenuTrigger
          render={
            <button
              type="button"
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-[var(--admin-radius-control)]",
                "text-admin-muted hover:bg-admin-tint hover:text-admin-text",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-focus",
              )}
              aria-label={labels.more}
              title={labels.more}
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </MenuTrigger>
        <MenuPortal>
          <MenuPositioner sideOffset={6} align="end">
            <MenuPopup>
              <MenuItem render={<Link href={`/admin/links/${id}`} />}>{labels.edit}</MenuItem>
              <MenuItem onClick={() => toggleRef.current?.requestSubmit()}>
                {enabled ? labels.disable : labels.enable}
              </MenuItem>
              <MenuItem disabled={isFirst} onClick={() => upRef.current?.requestSubmit()}>
                {labels.moveUp}
              </MenuItem>
              <MenuItem disabled={isLast} onClick={() => downRef.current?.requestSubmit()}>
                {labels.moveDown}
              </MenuItem>
              <MenuSeparator className="my-1 h-px bg-admin-line" />
              <MenuItem className="text-admin-danger" onClick={() => setConfirmOpen(true)}>
                {labels.delete}
              </MenuItem>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={labels.delete}
        description={labels.deleteConfirm}
        confirmLabel={labels.confirm}
        cancelLabel={labels.cancel}
        onConfirm={() => deleteRef.current?.requestSubmit()}
      />
    </div>
  );
}
