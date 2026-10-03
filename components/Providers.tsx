"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, STRINGS } from "@/lib/i18n";
import { store } from "@/lib/store";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  dark: boolean;
  toggleDark: () => void;
}
const AppCtx = createContext<Ctx>({ lang: "id", setLang: () => {}, t: (k) => k, dark: false, toggleDark: () => {} });
export const useApp = () => useContext(AppCtx);

export function Providers({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setLangState(store.getLang());
    const d = localStorage.getItem("risetai.dark") === "1" || window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(d);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("risetai.dark", dark ? "1" : "0"); } catch {}
  }, [dark]);
  const setLang = (l: Lang) => { setLangState(l); store.setLang(l); };
  const t = (k: string) => STRINGS[lang][k] ?? k;
  return <AppCtx.Provider value={{ lang, setLang, t, dark, toggleDark: () => setDark(!dark) }}>{children}</AppCtx.Provider>;
}
