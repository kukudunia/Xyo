import type { Article } from "./types";

export function apaCitation(a: Article): string {
  const authors =
    a.authors.length === 0
      ? ""
      : a.authors.length <= 7
        ? a.authors.join(", ")
        : `${a.authors.slice(0, 7).join(", ")}, ...`;
  const year = a.year ? `(${a.year}).` : "(t.t.).";
  const title = a.title.endsWith(".") ? a.title : `${a.title}.`;
  const journal = a.journal ? ` ${a.journal}.` : "";
  const doi = a.doi ? ` https://doi.org/${a.doi}` : "";
  return `${authors} ${year} ${title}${journal}${doi}`.trim();
}

export function bibtexCitation(a: Article): string {
  const first = (a.authors[0] || "anon").split(" ").pop()?.toLowerCase().replace(/[^a-z]/g, "") || "anon";
  const key = `${first}${a.year || "nodate"}`;
  const authors = a.authors.join(" and ");
  const lines = [
    `@article{${key},`,
    `  author = {${authors}},`,
    `  title = {${a.title}},`,
    a.journal ? `  journal = {${a.journal}},` : null,
    a.year ? `  year = {${a.year}},` : null,
    a.doi ? `  doi = {${a.doi}},` : null,
    a.url ? `  url = {${a.url}},` : null,
    `}`,
  ].filter(Boolean);
  return lines.join("\n");
}
