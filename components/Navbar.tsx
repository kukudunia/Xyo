"use client";
import Link from "next/link";
import { useApp } from "./Providers";

export function Navbar() {
  const { lang, setLang, t, dark, toggleDark } = useApp();
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-bold text-lg text-teal-700 dark:text-teal-400" aria-label="RisetAI home">RisetAI</Link>
        <nav className="flex gap-3 text-sm ml-2">
          <Link href="/library" className="hover:text-teal-700 dark:hover:text-teal-400">{t("library")}</Link>
          <Link href="/history" className="hover:text-teal-700 dark:hover:text-teal-400">{t("history")}</Link>
          <Link href="/compare" className="hover:text-teal-700 dark:hover:text-teal-400">{t("compare")}</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setLang(lang === "id" ? "en" : "id")} className="text-xs font-semibold px-2 py-1 rounded border border-slate-300 dark:border-slate-700" aria-label="Toggle language">
            {lang === "id" ? "EN" : "ID"}
          </button>
          <button onClick={toggleDark} className="text-sm px-2 py-1 rounded border border-slate-300 dark:border-slate-700" aria-label="Toggle dark mode">
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
