import type { Article } from "./types";

// Data contoh — HANYA dipakai saat API live gagal (mode demo, diberi label jelas).
export const DEMO_ARTICLES: Article[] = [
  {
    id: "W-demo-1",
    title: "Effects of regular aerobic exercise on sleep quality in adults: a systematic review",
    authors: ["Amelia Hartono", "Budi Santoso", "Citra Lestari"],
    year: 2023,
    journal: "Journal of Sleep Research (contoh)",
    abstract:
      "Background: Sleep problems affect millions of adults. Objective: To review evidence on aerobic exercise and sleep quality. Methods: Systematic review of 24 randomized trials with 1,842 participants. Results: Regular moderate aerobic exercise significantly improved subjective sleep quality (PSQI score reduction). Effects were positive across age groups. Limitations: Heterogeneity in exercise protocols; further research with standardized interventions is needed.",
    doi: null,
    url: null,
    openAccess: true,
    studyType: "Review",
    field: "Medicine",
    citedBy: 42,
    source: "demo",
  },
  {
    id: "W-demo-2",
    title: "No significant effect of vitamin D supplementation on fatigue: a randomized controlled trial",
    authors: ["Dewi Anggraini", "Eko Prasetyo"],
    year: 2022,
    journal: "Nutrition Trials (contoh)",
    abstract:
      "Objective: To test whether vitamin D supplementation reduces fatigue. Methods: Double-blind randomized controlled trial with 320 participants over 12 weeks. Results: No significant difference in fatigue scores between intervention and placebo groups. No effect was observed in subgroup analyses. Conclusion: Supplementation showed no benefit for fatigue in this population.",
    doi: null,
    url: null,
    openAccess: false,
    studyType: "Uji klinis",
    field: "Medicine",
    citedBy: 15,
    source: "demo",
  },
  {
    id: "W-demo-3",
    title: "Mindfulness interventions for student anxiety: mixed findings from a multi-campus study",
    authors: ["Farhan Yusuf", "Gita Maharani", "Hendra Wijaya", "Intan Permata"],
    year: 2024,
    journal: "Education & Wellbeing (contoh)",
    abstract:
      "Objective: To evaluate mindfulness programs for university student anxiety. Methods: Mixed-methods study across 5 campuses with 640 students. Results: Findings were mixed; two campuses showed reduced anxiety while others showed no difference. However, qualitative data suggested perceived benefit. Limitations include inconsistent program delivery and short follow-up. Further research is needed.",
    doi: null,
    url: null,
    openAccess: true,
    studyType: "Artikel jurnal",
    field: "Education",
    citedBy: 8,
    source: "demo",
  },
];
