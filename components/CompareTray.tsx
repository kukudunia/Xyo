"use client";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { useApp } from "./Providers";

export function CompareTray({ items, onClear }: { items: Article[]; onClear: () => void }) {
  const { t } = useApp();
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-full pl-5 pr-2 py-2 flex items-center gap-3 shadow-xl" role="status">
      <span className="text-sm">⚖ {items.length} {t("compareTray")}</span>
      <Link href="/compare" className="text-sm bg-teal-600 hover:bg-teal-500 rounded-full px-4 py-1.5">{t("compare")}</Link>
      <button onClick={onClear} className="text-sm px-2 opacity-70 hover:opacity-100" aria-label="Clear compare">✕</button>
    </div>
  );
}
