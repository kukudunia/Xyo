import type { Article, SearchParams, SearchResult } from "./types";
import { DEMO_ARTICLES } from "./demo-data";

const BASE = "https://api.openalex.org/works";

function decodeAbstract(inv: Record<string, number[]> | null | undefined): string | null {
  if (!inv) return null;
  const words: [string, number][] = [];
  for (const [w, pos] of Object.entries(inv)) for (const p of pos) words.push([w, p]);
  words.sort((a, b) => a[1] - b[1]);
  return words.map(([w]) => w).join(" ");
}

function studyTypeOf(w: any): string {
  const t = (w.type || "").toLowerCase();
  if (t.includes("review") || t.includes("meta")) return "Review";
  if (t.includes("trial") || t.includes("clinical")) return "Uji klinis";
  if (t.includes("article")) return "Artikel jurnal";
  if (t.includes("book") || t.includes("chapter")) return "Buku/Bab";
  if (t.includes("dataset")) return "Dataset";
  if (t.includes("preprint")) return "Preprint";
  return w.type || "Lainnya";
}

function fieldOf(w: any): string {
  const c = w.primary_topic?.display_name || w.topics?.[0]?.display_name || w.concepts?.[0]?.display_name;
  return c || "Umum";
}

function mapWork(w: any): Article {
  const doi: string | null = w.doi ? w.doi.replace(/^https?:\/\/doi\.org\//, "") : null;
  return {
    id: String(w.id || "").replace("https://openalex.org/", "") || `doi:${doi}`,
    title: w.display_name || w.title || "Tanpa judul",
    authors: (w.authorships || []).slice(0, 8).map((a: any) => a.author?.display_name).filter(Boolean),
    year: w.publication_year ?? null,
    journal: w.primary_location?.source?.display_name || w.host_venue?.display_name || null,
    abstract: decodeAbstract(w.abstract_inverted_index),
    doi,
    url: w.doi || w.primary_location?.landing_page_url || w.open_access?.oa_url || null,
    openAccess: !!w.open_access?.is_oa,
    studyType: studyTypeOf(w),
    field: fieldOf(w),
    citedBy: w.cited_by_count ?? 0,
    source: "openalex",
  };
}

export async function searchOpenAlex(p: SearchParams): Promise<SearchResult> {
  const params = new URLSearchParams();
  params.set("search", p.q);
  params.set("page", String(p.page || 1));
  params.set("per-page", String(Math.min(p.perPage || 10, 25)));
  if (p.sort === "newest") params.set("sort", "publication_year:desc");
  else if (p.sort === "cited") params.set("sort", "cited_by_count:desc");
  else params.set("sort", "relevance_score:desc");
  const filters: string[] = [];
  if (p.fromYear) filters.push(`from_publication_date:${p.fromYear}-01-01`);
  if (p.toYear) filters.push(`to_publication_date:${p.toYear}-12-31`);
  if (p.openAccessOnly) filters.push("is_oa:true");
  if (filters.length) params.set("filter", filters.join(","));
  const mailto = process.env.OPENALEX_MAILTO;
  if (mailto) params.set("mailto", mailto);
  const res = await fetch(`${BASE}?${params.toString()}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`OpenAlex HTTP ${res.status}`);
  const json = await res.json();
  let articles: Article[] = (json.results || []).map(mapWork);
  if (p.studyType) articles = articles.filter((a) => a.studyType === p.studyType);
  return { articles, total: json.meta?.count ?? articles.length, demo: false };
}

export async function getWorkById(id: string): Promise<Article> {
  const clean = id.startsWith("W") ? id : decodeURIComponent(id);
  const url = clean.startsWith("https://doi.org/") || clean.startsWith("10.")
    ? `${BASE}/https://doi.org/${clean.replace(/^https:\/\/doi\.org\//, "")}`
    : `${BASE}/${clean}`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`OpenAlex HTTP ${res.status}`);
  return mapWork(await res.json());
}

export function demoResult(q: string): SearchResult {
  const kw = q.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = DEMO_ARTICLES.map((a) => ({
    a,
    s: kw.reduce((n, k) => n + (a.title.toLowerCase().includes(k) || (a.abstract || "").toLowerCase().includes(k) ? 1 : 0), 0),
  }));
  scored.sort((x, y) => y.s - x.s);
  return { articles: scored.map((x) => x.a), total: scored.length, demo: true };
}
