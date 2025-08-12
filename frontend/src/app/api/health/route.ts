// Dev proxy ke backend hanya untuk demo (opsional).
// Next.js API route ini *bukan* pengganti backend.
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/health');
    const data = await res.json();
    return NextResponse.json({ ok: true, backend: data });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'failed' }, { status: 500 });
  }
}
