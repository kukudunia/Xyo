import type { Article } from "./types";

export type Stance = "mendukung" | "tidak-mendukung" | "campuran" | "belum-cukup-info";

export interface EvidenceItem {
  article: Article;
  stance: Stance;
  reason: string;
}

const SUPPORT = ["significant", "signifikan", "improve", "meningkat", "effective", "efektif", "benefit", "manfaat", "positive", "positif", "reduce", "menurunkan", "associated with", "berhubungan", "demonstrat", "membuktikan", "efficac"];
const AGAINST = ["no significant", "tidak signifikan", "ineffective", "tidak efektif", "no effect", "tidak ada efek", "no difference", "tidak ada perbedaan", "failed", "gagal", "adverse", "buruk", "negative", "negatif", "not associated", "tidak berhubungan", "insufficient evidence of", "lack of"];
const MIXED = ["mixed", "campuran", "inconsistent", "tidak konsisten", "controvers", "kontrovers", "however", "namun", "although", "meskipun", "limitations", "keterbatasan", "further research", "penelitian lanjutan"];

function countHits(text: string, dict: string[]): number {
  const t = text.toLowerCase();
  return dict.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
}

// Klasifikasi heuristik berbasis kata kunci pada ABSTRAK saja (bukan full-text).
// Bukan probabilitas kebenaran — hanya pengelompokan awal untuk eksplorasi.
export function classifyStance(a: Article, question: string): { stance: Stance; reason: string } {
  const abs = (a.abstract || "").toLowerCase();
  if (!abs || abs.length < 80) return { stance: "belum-cukup-info", reason: "Abstrak tidak tersedia / terlalu pendek untuk diklasifikasi." };
  const s = countHits(abs, SUPPORT);
  const g = countHits(abs, AGAINST);
  const m = countHits(abs, MIXED);
  void question;
  if (s > 0 && g > 0) return { stance: "campuran", reason: `Abstrak memuat penanda pro (${s}) dan kontra (${g}).` };
  if (g > s && g > 0) return { stance: "tidak-mendukung", reason: `Ditemukan ${g} penanda hasil nol/negatif pada abstrak.` };
  if (s > 0) return { stance: "mendukung", reason: `Ditemukan ${s} penanda hasil positif pada abstrak.` };
  if (m > 0) return { stance: "campuran", reason: `Abstrak memuat bahasa kehati-hatian / hasil tidak konsisten (${m} penanda).` };
  return { stance: "belum-cukup-info", reason: "Tidak ditemukan penanda arah hasil yang jelas pada abstrak." };
}

export function buildEvidence(articles: Article[], question: string): { items: EvidenceItem[]; counts: Record<Stance, number> } {
  const items = articles.map((article) => ({ article, ...classifyStance(article, question) }));
  const counts: Record<Stance, number> = { mendukung: 0, "tidak-mendukung": 0, campuran: 0, "belum-cukup-info": 0 };
  for (const i of items) counts[i.stance]++;
  return { items, counts };
}

// Ringkasan ekstraktif lokal: pilih kalimat abstrak yang paling relevan dgn query.
export function extractiveSummary(abstract: string | null, query: string, maxSentences = 3): string[] {
  if (!abstract) return [];
  const sentences = abstract.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g) || [abstract];
  const kw = query.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const scored = sentences.map((s) => {
    const low = s.toLowerCase();
    return { s: s.trim(), score: kw.reduce((n, k) => n + (low.includes(k) ? 1 : 0), 0) + (low.includes("conclusion") || low.includes("kesimpulan") || low.includes("result") || low.includes("hasil") ? 0.5 : 0) };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, maxSentences);
  // pertahankan urutan asli
  const order = new Map(sentences.map((s, i) => [s.trim(), i]));
  top.sort((a, b) => (order.get(a.s) ?? 0) - (order.get(b.s) ?? 0));
  return top.map((t) => t.s);
}

// Jawab pertanyaan berbasis abstrak (client-side extractive QA sederhana).
export function answerFromAbstract(abstract: string | null, question: string): { answer: string; sentences: string[] } {
  if (!abstract) return { answer: "Abstrak tidak tersedia untuk artikel ini.", sentences: [] };
  const sentences = extractiveSummary(abstract, question, 3);
  if (sentences.length === 0) return { answer: "Tidak ditemukan kalimat relevan pada abstrak.", sentences: [] };
  return { answer: sentences.join(" "), sentences };
}
