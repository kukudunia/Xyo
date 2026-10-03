"use client";
import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";
import { apaCitation, bibtexCitation } from "@/lib/citations";
import { store } from "@/lib/store";
import { useApp } from "@/components/Providers";
import Link from "next/link";

export default function LibraryPage() {
  const { t } = useApp();
  const [items, setItems] = useState<Article[]>([]);
  const [folders, setFolders] = useState<{ id: string; name: string; articleIds: string[] }[]>([]);
  const [newFolder, setNewFolder] = useState("");
  useEffect(() => { setItems(store.getBookmarks()); setFolders(store.getFolders()); }, []);
  const remove = (id: string) => {
    const a = items.find((x) => x.id === id);
    if (a) store.toggleBookmark(a);
    setItems(store.getBookmarks());
  };
  const exportText = (fn: (a: Article) => string, ext: string) => {
    const blob = new Blob([items.map(fn).join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = `risetai-library.${ext}`; el.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="pt-6 max-w-4xl">
      <h1 className="text-2xl font-bold">📚 {t("library")}</h1>
      <p className="text-xs text-slate-500 mt-1">{t("localMode")}</p>
      <div className="flex gap-2 mt-3 text-sm">
        <button onClick={() => exportText(apaCitation, "txt")} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">{t("exportApa")}</button>
        <button onClick={() => exportText(bibtexCitation, "bib")} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">{t("exportBib")}</button>
      </div>
      <div className="mt-5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="font-semibold text-sm">📁 {t("folders")}</h2>
        <form className="flex gap-2 mt-2" onSubmit={(e) => { e.preventDefault(); if (newFolder.trim()) { store.addFolder(newFolder.trim()); setNewFolder(""); setFolders(store.getFolders()); } }}>
          <input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder={t("newFolder")} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm" />
          <button className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-sm">+</button>
        </form>
        <div className="flex flex-wrap gap-2 mt-2 text-sm">
          {folders.map((f) => <span key={f.id} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800">{f.name} ({f.articleIds.length})</span>)}
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {items.length === 0 && <p className="text-slate-500 text-sm">Belum ada simpanan.</p>}
        {items.map((a) => (
          <div key={a.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Link href={a.source === "demo" ? "#" : `/article/${encodeURIComponent(a.id)}`} className="font-semibold hover:text-teal-700">{a.title}</Link>
            <p className="text-xs text-slate-500 mt-1">{a.authors.slice(0, 3).join(", ")} · {a.year ?? "—"}</p>
            <div className="flex gap-2 mt-2 text-xs">
              <button onClick={() => remove(a.id)} className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700">{t("removeCompare")}</button>
              <button onClick={() => navigator.clipboard.writeText(apaCitation(a))} className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700">{t("copyCite")}</button>
              {folders.length > 0 && (
                <select onChange={(e) => { if (e.target.value) { store.addToFolder(e.target.value, a.id); setFolders(store.getFolders()); } }} defaultValue="" className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <option value="">+ Folder</option>
                  {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
