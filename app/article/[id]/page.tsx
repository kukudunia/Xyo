"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { answerFromAbstract } from "@/lib/evidence";
import { apaCitation } from "@/lib/citations";
import { store } from "@/lib/store";
import { useApp } from "@/components/Providers";

function splitSections(abs: string | null) {
  if (!abs) return { objective: null as string | null, methods: null as string | null, sample: null as string | null, findings: null as string | null, limitations: null as string | null };
  const t = abs.replace(/\s+/g, " ");
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      const i = t.toLowerCase().indexOf(k);
      if (i >= 0) return t.slice(i).split(/(?=[A-Z][a-z]+:)|(?=\.\s+[A-Z])/)[0].slice(0, 400);
    }
    return null;
  };
  return {
    objective: pick("objective:", "background:", "purpose:", "tujuan:"),
    methods: pick("methods:", "method:", "metode:"),
    sample: pick("participants", "sample", "sampel", "partisipan"),
    findings: pick("results:", "findings:", "conclusion:", "hasil:", "kesimpulan:"),
    limitations: pick("limitation", "keterbatasan"),
  };
}

export default function ArticleDetail({ params }: { params: { id: string } }) {
  const { t } = useApp();
  const [article, setArticle] = useState<Article | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/article/${params.id}`);
        if (!res.ok) { setNotFound(true); return; }
        const j = await res.json();
        setArticle(j.article); setDemo(!!j.demo);
        setSaved(store.isBookmarked(j.article.id));
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [params.id]);

  if (loading) return <p className="pt-10 text-center text-slate-500">{t("loading")}</p>;
  if (notFound || !article) return (
    <div className="pt-10 text-center">
      <p className="text-slate-500">{t("error")}</p>
      <Link href="/" className="text-teal-700 underline">← {t("back")}</Link>
    </div>
  );

  const sec = splitSections(article.abstract);
  return (
    <div className="pt-6 max-w-3xl">
      <Link href="javascript:history.back()" className="text-sm text-teal-700 dark:text-teal-400">← {t("back")}</Link>
      {demo && <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">⚠ {t("demoMode")}</div>}
      <h1 className="text-2xl font-bold mt-3 leading-snug">{article.title}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
        {article.authors.join(", ")} · {article.year ?? "—"}{article.journal ? ` · ${article.journal}` : ""}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-2 text-xs">
        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">{article.studyType}</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{article.field}</span>
        {article.openAccess && <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-800">OA</span>}
      </div>
      <div className="flex flex-wrap gap-2 mt-4 text-sm">
        <button onClick={() => setSaved(store.toggleBookmark(article))} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">{saved ? `✓ ${t("saved")}` : t("save")}</button>
        <button onClick={async () => { await navigator.clipboard.writeText(apaCitation(article)); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">{copied ? t("copied") : t("copyCite")}</button>
        {(article.doi || article.url) && <a href={article.doi ? `https://doi.org/${article.doi}` : article.url!} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-teal-700 underline">DOI ↗</a>}
      </div>

      <section className="mt-6 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h2 className="font-bold">📄 {t("abstract")}</h2>
        <p className="text-xs text-slate-500 mt-1">{t("abstractOnly")}</p>
        <p className="text-sm mt-2 leading-relaxed whitespace-pre-wrap">{article.abstract || "—"}</p>
      </section>

      <div className="grid md:grid-cols-2 gap-3 mt-3 text-sm">
        {[[t("objective"), sec.objective], [t("methods"), sec.methods], [t("sample"), sec.sample], [t("findings"), sec.findings], [t("limitations"), sec.limitations]].map(([label, val]) => (
          <div key={label as string} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-sm">{label}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{val || "—"}</p>
          </div>
        ))}
      </div>

      <section className="mt-3 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h2 className="font-bold">💬 {t("askArticle")}</h2>
        <form className="flex gap-2 mt-3" onSubmit={(e) => { e.preventDefault(); setAnswer(answerFromAbstract(article.abstract, question).answer); }}>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t("askPlaceholder")} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:ring-2 focus:ring-teal-500" />
          <button className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold">Tanya</button>
        </form>
        {answer && <p className="text-sm mt-3 p-3 rounded-lg bg-teal-50 dark:bg-teal-950 leading-relaxed">{answer}</p>}
      </section>
    </div>
  );
}
