# Admin UI

Admin uses **`@base-ui/react` + Tailwind v4**, Cal.com-style shell.

## Layout

- `components/admin/app-shell.tsx` — sidebar + mobile drawer
- `AdminPageHeader` / `AdminSection` — page chrome
- Appearance menu (color + locale) at sidebar bottom; logout is a separate row

## Primitives (`components/base`)

- Button, Field/Input, Select, Switch, Dialog, Menu, Alert, Badge
- Control height: 40px (`h-10`). Primary = near-black / near-white.
- Links list: `LinkRowActions` (switch + overflow menu). Edit is a dedicated page.

## Rules

1. Admin only `@base-ui/react` + `components/base` — no Radix / Kumo.
2. `LinkButton` for links that look like buttons.
3. `Button` must set `type="submit"` or `type="button"`.
4. POST forms keep CSRF hidden fields.
5. Destructive actions use `ConfirmSubmitButton` / `ConfirmDialog`.
6. Icons: `lucide-react`. Icon-only controls need `aria-label` + `title`.

Public site stays on `components/ui` and `src/themes` tokens. Do not restyle public links with Admin tokens.
