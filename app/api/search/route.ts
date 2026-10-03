import { NextRequest, NextResponse } from "next/server";
import { searchOpenAlex, demoResult } from "@/lib/openalex";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get("q") || "").trim();
  if (!q) return NextResponse.json({ articles: [], total: 0, demo: false });
  const params = {
    q,
    page: Number(sp.get("page") || 1),
    perPage: 10,
    fromYear: sp.get("fromYear") ? Number(sp.get("fromYear")) : null,
    toYear: sp.get("toYear") ? Number(sp.get("toYear")) : null,
    openAccessOnly: sp.get("oa") === "1",
    studyType: sp.get("studyType") || null,
    sort: (sp.get("sort") as "relevance" | "newest" | "cited") || "relevance",
  };
  try {
    const r = await searchOpenAlex(params);
    return NextResponse.json(r);
  } catch {
    return NextResponse.json(demoResult(q));
  }
}
