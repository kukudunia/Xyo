# RisetAI — Temukan jawaban dari penelitian ilmiah

Platform pencarian dan analisis penelitian ilmiah (terinspirasi Consensus.app, desain orisinal).
Data artikel **nyata** dari [OpenAlex](https://openalex.org) + [Crossref](https://www.crossref.org) (gratis, tanpa API key).

## Fitur

- **Beranda** — search bar besar, contoh pertanyaan, toggle ID/EN + dark mode
- **Hasil pencarian** — ringkasan jawaban ekstraktif + sitasi, kartu artikel, filter tahun/bidang/jenis/OA, sort, pagination
- **Ringkasan bukti** — klasifikasi Mendukung / Tidak mendukung / Campuran / Belum cukup info (heuristik kata kunci pada **abstrak saja**, bukan probabilitas kebenaran)
- **Detail artikel** — abstrak, tujuan/metode/sampel/temuan/keterbatasan (heuristik), Tanya artikel (extractive QA client-side)
- **Perbandingan** — pilih ≤4 artikel, tabel perbandingan
- **Koleksi & riwayat** — bookmark + folder + riwayat (localStorage; Supabase opsional), ekspor APA & BibTeX
- **Mode demo** — jika API tidak terjangkau, tampil data contoh berlabel jelas (`lib/demo-data.ts`)

## Instalasi

```bash
cd risetai
npm install
cp .env.example .env   # opsional
npm run dev            # http://localhost:3000
```

Build produksi:

```bash
npm run build
npm start
```

## Konfigurasi (opsional, semua boleh kosong)

| Variabel | Fungsi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth & sinkronisasi koleksi (tanpa ini = mode lokal) |
| `OPENAI_API_KEY` | AI synthesis generatif (tanpa ini = ringkasan ekstraktif lokal) |
| `OPENALEX_MAILTO` | Email kontak untuk API OpenAlex (disarankan) |

Schema Supabase: `supabase/schema.sql` (jalankan di SQL editor).

## Struktur

```
app/
  page.tsx              Beranda
  search/page.tsx       Hasil + ringkasan + bukti
  article/[id]/page.tsx Detail + Tanya artikel
  compare/page.tsx      Perbandingan
  library/page.tsx      Koleksi + ekspor
  history/page.tsx      Riwayat
  api/search/route.ts   Proxy OpenAlex (fallback demo)
  api/article/[id]/route.ts  Detail work (fallback demo)
lib/
  openalex.ts crossref.ts citations.ts evidence.ts
  demo-data.ts types.ts i18n.ts store.ts supabase.ts
components/  supabase/
```

## Kejujuran data

- Tidak ada artikel/DOI/penulis yang dikarang — semua dari API live.
- Analisis hanya pada **abstrak**, selalu diberi label.
- Klasifikasi bukti = pengelompokan kata kunci awal, bukan penilaian kebenaran.
