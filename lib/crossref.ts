import type { Article } from "./types";

// Crossref sebagai sumber pelengkap (metadata + link). Dipakai untuk memperkaya DOI.
export async function enrichFromCrossref(a: Article): Promise<Article> {
  if (!a.doi) return a;
  try {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(a.doi)}`, {
      headers: { "User-Agent": "RisetAI/0.1 (mailto:hello@risetai.app)" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return a;
    const m = (await res.json()).message || {};
    return {
      ...a,
      journal: a.journal || (m["container-title"]?.[0] ?? null),
      url: a.url || m.URL || (m.link?.[0]?.URL ?? null),
      year: a.year ?? m.published?.["date-parts"]?.[0]?.[0] ?? m.created?.["date-parts"]?.[0]?.[0] ?? null,
    };
  } catch {
    return a;
  }
}
