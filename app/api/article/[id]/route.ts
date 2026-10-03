import { NextRequest, NextResponse } from "next/server";
import { getWorkById } from "@/lib/openalex";
import { DEMO_ARTICLES } from "@/lib/demo-data";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const raw = decodeURIComponent(params.id);
  const demo = DEMO_ARTICLES.find((a) => a.id === raw);
  if (demo) return NextResponse.json({ article: demo, demo: true });
  try {
    let id = raw;
    if (id.startsWith("doi:")) id = `https://doi.org/${id.slice(4)}`;
    const article = await getWorkById(id);
    return NextResponse.json({ article, demo: false });
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
