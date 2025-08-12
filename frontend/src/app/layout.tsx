import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O&G Monitor",
  description: "Pencarian dan daftar berita Oil & Gas yang modern",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
