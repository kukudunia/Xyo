"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { store } from "@/lib/store";
import { useApp } from "@/components/Providers";

export default function HistoryPage() {
  const { t } = useApp();
  const [items, setItems] = useState<{ q: string; at: number }[]>([]);
  useEffect(() => { setItems(store.getHistory()); }, []);
  return (
    <div className="pt-6 max-w-3xl">
      <h1 className="text-2xl font-bold">🕘 {t("history")}</h1>
      {items.length > 0 && (
        <button
          onClick={() => { store.clearHistory(); setItems([]); }}
          className="mt-2 text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700"
        >
          {t("clearHistory")}
        </button>
      )}
      <div className="mt-4 space-y-2">
        {items.length === 0 && <p className="text-slate-500 text-sm">Belum ada riwayat.</p>}
        {items.map((h) => (
          <Link
            key={`${h.q}-${h.at}`}
            href={`/search?q=${encodeURIComponent(h.q)}`}
            className="block p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 text-sm"
          >
            {h.q}
            <span className="block text-xs text-slate-500">{new Date(h.at).toLocaleString()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
