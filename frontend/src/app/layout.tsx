import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O&G Monitor",
  description: "Berita Oil & Gas Indonesia",
};

function ThemeInitScript() {
  const code = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var wantDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var root = document.documentElement;
    if (wantDark) root.classList.add('dark'); else root.classList.remove('dark');
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head><ThemeInitScript /></head>
      <body className="antialiased bg-neutral-50 dark:bg-neutral-950">{children}</body>
    </html>
  );
}
