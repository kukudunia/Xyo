"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Article, SearchResult } from "@/lib/types";
import { buildEvidence } from "@/lib/evidence";
import { extractiveSummary } from "@/lib/evidence";
import { ArticleCard } from "@/components/ArticleCard";
import { notifyCompare } from "@/components/AppShell";
import { store } from "@/lib/store";
import { useApp } from "@/components/Providers";

const STANCE_STYLE: Record<string, string> = {
  mendukung: "bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900",
  "tidak-mendukung": "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  campuran: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  "belum-cukup-info": "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

function SearchInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { t, lang } = useApp();
  const q = sp.get("q") || "";
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [oa, setOa] = useState(false);
  const [studyType, setStudyType] = useState("");
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [box, setBox] = useState(q);

  const load = useCallback(async () => {
    if (!q.trim()) return;
    setLoading(true); setError(false);
    try {
      const p = new URLSearchParams({ q, page: String(page), sort });
      if (fromYear) p.set("fromYear", fromYear);
      if (toYear) p.set("toYear", toYear);
      if (oa) p.set("oa", "1");
      if (studyType) p.set("studyType", studyType);
      const res = await fetch(`/api/search?${p.toString()}`);
      if (!res.ok) throw new Error("http");
      setData(await res.json());
      store.pushHistory(q);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [q, page, sort, fromYear, toYear, oa, studyType]);

  useEffect(() => { setBox(q); setPage(1); }, [q]);
  useEffect(() => { load(); }, [load]);

  const ev = data ? buildEvidence(data.articles, q) : null;
  const summary = data && data.articles.length > 0
    ? extractiveSummary(data.articles.slice(0, 5).map((a) => a.abstract || "").join(" "), q, 3)
    : [];

  const onCompare = (a: Article) => {
    store.toggleCompare(a);
    notifyCompare();
  };

  return (
    <div className="pt-6">
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (box.trim()) router.push(`/search?q=${encodeURIComponent(box.trim())}`); }}>
        <input value={box} onChange={(e) => setBox(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-teal-500" aria-label="Search" />
        <button className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700">{t("search")}</button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-sm items-center">
        <input value={fromYear} onChange={(e) => setFromYear(e.target.value)} placeholder={t("yearFrom")} inputMode="numeric" className="w-28 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
        <input value={toYear} onChange={(e) => setToYear(e.target.value)} placeholder={t("yearTo")} inputMode="numeric" className="w-28 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
        <select value={studyType} onChange={(e) => setStudyType(e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          <option value="">{t("studyType")}: {t("all")}</option>
          <option>Artikel jurnal</option><option>Review</option><option>Uji klinis</option><option>Preprint</option><option>Buku/Bab</option><option>Dataset</option><option>Lainnya</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          <option value="relevance">{t("relevance")}</option>
          <option value="newest">{t("newest")}</option>
          <option value="cited">{t("cited")}</option>
        </select>
        <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={oa} onChange={(e) => setOa(e.target.checked)} /> {t("openAccess")}</label>
      </div>

      {loading && <p className="mt-8 text-center text-slate-500">{t("loading")}</p>}
      {error && <p className="mt-8 text-center text-red-600">{t("error")}</p>}

      {!loading && !error && data && (
        <>
          {data.demo && <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">⚠ {t("demoMode")}</div>}

          {data.articles.length > 0 && (
            <section className="mt-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" aria-label={t("aiSummary")}>
              <h2 className="font-bold">✦ {t("aiSummary")}</h2>
              <p className="text-xs text-slate-500 mt-1">{t("abstractOnly")}</p>
              <ul className="mt-2 space-y-1.5 text-sm list-disc pl-5">
                {summary.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </section>
          )}

          {ev && data.articles.length > 0 && (
            <section className="mt-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" aria-label={t("evidence")}>
              <h2 className="font-bold">📊 {t("evidence")}</h2>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {(Object.keys(ev.counts) as (keyof typeof ev.counts)[]).map((k) => (
                  <span key={k} className={`px-2.5 py-1 rounded-full border ${STANCE_STYLE[k]}`}>{k}: {ev.counts[k]}</span>
                ))}
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {ev.items.slice(0, 6).map((it) => (
                  <div key={it.article.id} className="flex gap-2 items-start">
                    <span className={`shrink-0 px-2 py-0.5 rounded-full border text-xs ${STANCE_STYLE[it.stance]}`}>{it.stance}</span>
                    <span className="text-slate-600 dark:text-slate-400">{it.article.title} — <span className="text-xs">{it.reason}</span></span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <p className="text-sm text-slate-500 mt-4">{data.total.toLocaleString(lang === "id" ? "id-ID" : "en-US")} hasil{q ? ` untuk “${q}”` : ""}</p>
          {data.articles.length === 0 && <p className="mt-6 text-center text-slate-500">{t("noResults")}</p>}
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {data.articles.map((a) => <ArticleCard key={a.id} article={a} onCompare={onCompare} />)}
          </div>
          <div className="flex gap-2 justify-center mt-6">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40">←</button>
            <span className="px-2 py-2 text-sm">Hal. {page}</span>
            <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700">→</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="pt-10 text-center text-slate-500">Memuat…</p>}>
      <SearchInner />
    </Suspense>
  );
}
