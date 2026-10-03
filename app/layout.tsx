import "./globals.css";
import { Providers } from "@/components/Providers";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "RisetAI — Temukan jawaban dari penelitian ilmiah",
  description: "Telusuri artikel ilmiah, ringkasan berbasis bukti dengan sitasi terverifikasi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          <AppShell>
            <main className="max-w-6xl mx-auto px-4 pb-24">{children}</main>
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}
