"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { store } from "@/lib/store";
import { useApp } from "@/components/Providers";

const ROWS: { key: keyof Article | "tujuan"; labelKey: string }[] = [
  { key: "title", labelKey: "title" },
  { key: "authors", labelKey: "authors" },
  { key: "year", labelKey: "year" },
  { key: "journal", labelKey: "journal" },
  { key: "studyType", labelKey: "studyType" },
  { key: "field", labelKey: "field" },
  { key: "abstract", labelKey: "abstract" },
];

export default function ComparePage() {
  const { t } = useApp();
  const [items, setItems] = useState<Article[]>([]);
  useEffect(() => { setItems(store.getCompare()); }, []);
  if (items.length === 0)
    return (
      <div className="pt-10 text-center">
        <p className="text-slate-500">Belum ada artikel untuk dibandingkan. Cari lalu tekan ⚖ {t("compare")}.</p>
        <Link href="/" className="text-teal-700 underline">← {t("home")}</Link>
      </div>
    );
  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold">⚖ {t("compareTitle")} ({items.length})</h1>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="text-left p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 w-32">—</th>
              {items.map((a) => (
                <th key={a.id} className="text-left p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 align-top">
                  <Link href={a.source === "demo" ? "#" : `/article/${a.id}`} className="hover:text-teal-700 font-semibold line-clamp-4">{a.title}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { l: "Penulis", f: (a: Article) => a.authors.join(", ") || "—" },
              { l: "Tahun", f: (a: Article) => String(a.year ?? "—") },
              { l: "Jurnal", f: (a: Article) => a.journal || "—" },
              { l: "Jenis", f: (a: Article) => a.studyType },
              { l: "Bidang", f: (a: Article) => a.field },
              { l: "OA", f: (a: Article) => (a.openAccess ? "Ya" : "Tidak") },
              { l: "Disitasi", f: (a: Article) => String(a.citedBy) },
              { l: "Abstrak", f: (a: Article) => (a.abstract ? a.abstract.slice(0, 300) + "…" : "—") },
            ].map((r) => (
              <tr key={r.l}>
                <td className="p-3 border border-slate-200 dark:border-slate-800 font-semibold bg-slate-50 dark:bg-slate-900 align-top">{r.l}</td>
                {items.map((a) => (
                  <td key={a.id} className="p-3 border border-slate-200 dark:border-slate-800 align-top text-slate-700 dark:text-slate-300">{r.f(a)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => { store.clearCompare(); setItems([]); try { window.dispatchEvent(new Event("risetai:compare")); } catch {} }}
        className="mt-4 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm"
      >
        ✕ Kosongkan
      </button>
    </div>
  );
}
