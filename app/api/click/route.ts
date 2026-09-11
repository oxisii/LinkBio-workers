import { getStore, waitUntil } from "@/lib/env";

export const dynamic = "force-dynamic";

async function readClickId(req: Request): Promise<string> {
  const raw = await req.text();
  if (!raw) return "";
  try {
    const body = JSON.parse(raw) as { id?: unknown };
    return typeof body.id === "string" ? body.id.slice(0, 64) : "";
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const id = await readClickId(req);
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  const store = await getStore();
  const links = await store.getLinks();
  if (!links.some((l) => l.id === id && l.enabled)) {
    return Response.json({ error: "Unknown id" }, { status: 404 });
  }

  await waitUntil(store.incrementLinkClick(id));
  return Response.json({ ok: true });
}
