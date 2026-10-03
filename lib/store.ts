"use client";
// Helper localStorage untuk bookmark, folder, riwayat, compare tray, preferensi.
import type { Article } from "./types";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch { /* abaikan */ }
}

export const store = {
  getBookmarks(): Article[] { return read<Article[]>("risetai.bookmarks", []); },
  toggleBookmark(a: Article): boolean {
    const list = store.getBookmarks();
    const exists = list.some((x) => x.id === a.id);
    write("risetai.bookmarks", exists ? list.filter((x) => x.id !== a.id) : [...list, a]);
    return !exists;
  },
  isBookmarked(id: string): boolean { return store.getBookmarks().some((x) => x.id === id); },

  getFolders(): { id: string; name: string; articleIds: string[] }[] { return read("risetai.folders", []); },
  addFolder(name: string) {
    const f = store.getFolders();
    write("risetai.folders", [...f, { id: `f-${Date.now()}`, name, articleIds: [] }]);
  },
  addToFolder(folderId: string, articleId: string) {
    write("risetai.folders", store.getFolders().map((f) => (f.id === folderId && !f.articleIds.includes(articleId) ? { ...f, articleIds: [...f.articleIds, articleId] } : f)));
  },

  getHistory(): { q: string; at: number }[] { return read("risetai.history", []); },
  pushHistory(q: string) {
    const h = [{ q, at: Date.now() }, ...store.getHistory().filter((x) => x.q !== q)].slice(0, 30);
    write("risetai.history", h);
  },
  clearHistory() { write("risetai.history", []); },

  getCompare(): Article[] { return read<Article[]>("risetai.compare", []); },
  toggleCompare(a: Article): Article[] {
    const list = store.getCompare();
    const next = list.some((x) => x.id === a.id) ? list.filter((x) => x.id !== a.id) : [...list, a].slice(0, 4);
    write("risetai.compare", next);
    return next;
  },
  clearCompare() { write("risetai.compare", []); },

  getLang(): "id" | "en" { return read<"id" | "en">("risetai.lang", "id"); },
  setLang(l: "id" | "en") { write("risetai.lang", l); },
};
