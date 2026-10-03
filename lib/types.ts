export interface Article {
  id: string; // OpenAlex id (W...) or doi:...
  title: string;
  authors: string[];
  year: number | null;
  journal: string | null;
  abstract: string | null;
  doi: string | null;
  url: string | null;
  openAccess: boolean;
  studyType: string;
  field: string;
  citedBy: number;
  source: "openalex" | "crossref" | "demo";
}

export interface SearchParams {
  q: string;
  page?: number;
  perPage?: number;
  fromYear?: number | null;
  toYear?: number | null;
  openAccessOnly?: boolean;
  studyType?: string | null;
  sort?: "relevance" | "newest" | "cited";
}

export interface SearchResult {
  articles: Article[];
  total: number;
  demo: boolean;
}
