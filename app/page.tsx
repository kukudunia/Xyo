"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { EXAMPLE_QUESTIONS } from "@/lib/i18n";

export default function Home() {
  const { t, lang } = useApp();
  const [q, setQ] = useState("");
  const router = useRouter();
  const go = (query: string) => {
    const v = query.trim();
    if (v) router.push(`/search?q=${encodeURIComponent(v)}`);
  };
  return (
    <div className="pt-16 pb-10 text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
        ● OpenAlex + Crossref · data nyata
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-5">{t("tagline")}</h1>
      <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg">{t("sub")}</p>
      <form
        className="mt-8 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); go(q); }}
        role="search"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label="Search"
          className="flex-1 px-5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-base outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button type="submit" className="px-6 py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700">
          {t("search")}
        </button>
      </form>
      <div className="mt-6 text-left">
        <p className="text-sm text-slate-500 mb-2">{t("examples")}</p>
        <div className="flex flex-col gap-2">
          {EXAMPLE_QUESTIONS[lang].map((ex) => (
            <button
              key={ex}
              onClick={() => go(ex)}
              className="text-left text-sm px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300 bg-white dark:bg-slate-900"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
