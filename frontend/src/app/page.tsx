import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ArkWork Starter</h1>
        <nav className="space-x-4">
          <Link className="underline" href="/api/health" target="_blank">API Health</Link>
          <a className="underline" href="https://github.com/hempart" target="_blank">GitHub</a>
        </nav>
      </header>
      <section className="mt-8 space-y-4">
        <p>Halo! Ini frontend starter. Edit <code>src/app/page.tsx</code> untuk mulai.</p>
        <p>Backend default di <code>http://localhost:4000</code>. Ubah via <code>NEXT_PUBLIC_API_URL</code>.</p>
      </section>
    </main>
  );
}
