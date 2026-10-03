"use client";
import { useState } from "react";
import type { Article } from "@/lib/types";
import { apaCitation } from "@/lib/citations";
import { store } from "@/lib/store";
import { useApp } from "./Providers";
import Link from "next/link";

export function ArticleCard({ article, onCompare }: { article: Article; onCompare?: (a: Article) => void }) {
  const { t } = useApp();
  const [saved, setSaved] = useState(() => (typeof window !== "undefined" ? store.isBookmarked(article.id) : false));
  const [copied, setCopied] = useState(false);
  const detailHref = article.id.startsWith("W-") && article.source !== "demo"
    ? `/article/${article.id}`
    : `/article/${encodeURIComponent(article.doi ? `doi:${article.doi}` : article.id)}`;

  return (
    <article className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
      <Link href={detailHref} className="font-semibold text-base leading-snug hover:text-teal-700 dark:hover:text-teal-400">
        {article.title}
      </Link>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
        {article.authors.slice(0, 4).join(", ")}{article.authors.length > 4 ? " et al." : ""} · {article.year ?? "—"}{article.journal ? ` · ${article.journal}` : ""}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-2 text-xs">
        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">{article.studyType}</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{article.field}</span>
        {article.openAccess && <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300">OA</span>}
        {article.source === "demo" && <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">demo</span>}
        {article.citedBy > 0 && <span className="px-2 py-0.5 text-slate-500">📑 {article.citedBy}</span>}
      </div>
      {article.abstract && <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 line-clamp-3">{article.abstract}</p>}
      <div className="flex flex-wrap gap-2 mt-3 text-sm">
        <Link href={detailHref} className="px-3 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700">{t("viewDetail")}</Link>
        <button onClick={() => setSaved(store.toggleBookmark(article))} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-teal-600" aria-pressed={saved}>
          {saved ? `✓ ${t("saved")}` : t("save")}
        </button>
        <button onClick={async () => { await navigator.clipboard.writeText(apaCitation(article)); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-teal-600">
          {copied ? t("copied") : t("copyCite")}
        </button>
        {onCompare && <button onClick={() => onCompare(article)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-teal-600">⚖ {t("compare")}</button>}
        {(article.doi || article.url) && (
          <a href={article.doi ? `https://doi.org/${article.doi}` : article.url!} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-teal-700 dark:text-teal-400 underline">
            DOI ↗
          </a>
        )}
      </div>
    </article>
  );
}
