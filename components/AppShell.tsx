"use client";
import { useCallback, useEffect, useState } from "react";
import type { Article } from "@/lib/types";
import { store } from "@/lib/store";
import { Navbar } from "./Navbar";
import { CompareTray } from "./CompareTray";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Article[]>([]);
  const refresh = useCallback(() => {
    try { setItems(store.getCompare()); } catch { setItems([]); }
  }, []);
  useEffect(() => {
    refresh();
    window.addEventListener("risetai:compare", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("risetai:compare", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);
  return (
    <>
      <Navbar />
      {children}
      <CompareTray items={items} onClear={() => { store.clearCompare(); refresh(); window.dispatchEvent(new Event("risetai:compare")); }} />
    </>
  );
}

export function notifyCompare() {
  try { window.dispatchEvent(new Event("risetai:compare")); } catch {}
}
