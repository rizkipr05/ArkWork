import { NextResponse } from "next/server";

export type News = {
  id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  url: string;
  category: string; // Upstream | Downstream | LNG | Policy | Price | Services
  region: string;   // Global/Asia/US/EU/ME/ID
  publishedAt: string; // ISO
};

const MOCK: News[] = [
  {
    id: "1",
    title: "Rig Baru Mulai Produksi di Lapangan Offshore Asia Tenggara",
    description:
      "Tahap first oil dicapai lebih cepat 3 bulan dengan produksi awal 20 ribu bopd.",
    image:
      "https://images.unsplash.com/photo-1582192730841-2a682d7375b8?q=80&w=1200&auto=format&fit=crop",
    source: "Upstream Today",
    url: "#",
    category: "Upstream",
    region: "Asia",
    publishedAt: "2025-08-11T05:10:00Z",
  },
  {
    id: "2",
    title: "Harga Minyak Menguat Setelah Pemangkasan Pasokan",
    description:
      "Brent ditutup menguat di tengah sinyal perpanjangan pemotongan produksi.",
    image:
      "https://images.unsplash.com/photo-1517976487492-576ea6b2936d?q=80&w=1200&auto=format&fit=crop",
    source: "MarketWire Energy",
    url: "#",
    category: "Price",
    region: "Global",
    publishedAt: "2025-08-12T02:30:00Z",
  },
  {
    id: "3",
    title: "Proyek LNG Baru Kantongi FID, Kapasitas 6.5 mtpa",
    description:
      "Konsorsium mengamankan pembiayaan dan kontrak offtake jangka panjang.",
    image:
      "https://images.unsplash.com/photo-1581090464536-9e0a6fdc2a3f?q=80&w=1200&auto=format&fit=crop",
    source: "Gas Journal",
    url: "#",
    category: "LNG",
    region: "ME",
    publishedAt: "2025-08-10T11:45:00Z",
  },
  {
    id: "4",
    title: "Kilang Utama Selesaikan Turnaround, Kapasitas Kembali 300 ribu bpd",
    description:
      "Unit hydrocracker selesai perbaikan, pasokan BBM domestik meningkat.",
    image:
      "https://images.unsplash.com/photo-1542601098-8fc114e148e8?q=80&w=1200&auto=format&fit=crop",
    source: "Refining Daily",
    url: "#",
    category: "Downstream",
    region: "ID",
    publishedAt: "2025-08-09T07:15:00Z",
  },
  {
    id: "5",
    title: "Regulasi Baru Pajak Karbon untuk Sektor Migas",
    description:
      "Pemerintah merilis pedoman transisi, mencakup flare, venting, dan CCS.",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    source: "Energy Policy Watch",
    url: "#",
    category: "Policy",
    region: "EU",
    publishedAt: "2025-08-08T13:00:00Z",
  },
  {
    id: "6",
    title: "Kontrak Jasa Seismik 3D 1.200 km² Diumumkan",
    description:
      "Kampanye akuisisi akan dimulai Q4 untuk mendukung rencana pengeboran 2026.",
    image:
      "https://images.unsplash.com/photo-1581091214421-7c77dfe8e2d3?q=80&w=1200&auto=format&fit=crop",
    source: "ServiceWire",
    url: "#",
    category: "Services",
    region: "Global",
    publishedAt: "2025-08-07T04:40:00Z",
  },
  {
    id: "7",
    title: "Lifted: Pembatasan Ekspor Solar Sementara Dicabut",
    description:
      "Pelaku pasar memperkirakan arus ekspor meningkat dari Asia ke Australia.",
    image:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop",
    source: "Downstream Pulse",
    url: "#",
    category: "Downstream",
    region: "Asia",
    publishedAt: "2025-08-06T09:20:00Z",
  },
  {
    id: "8",
    title: "Sumur Eksplorasi Laut Dalam Temukan Cadangan Gas Signifikan",
    description:
      "Temuan awal setara 1.2 tcf in-place menunggu uji alir lanjutan.",
    image:
      "https://images.unsplash.com/photo-1504119574057-1c14fb8b95a3?q=80&w=1200&auto=format&fit=crop",
    source: "Upstream Insight",
    url: "#",
    category: "Upstream",
    region: "ME",
    publishedAt: "2025-08-05T21:05:00Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "Semua";
  const region = searchParams.get("region") || "Semua";
  const take = Number(searchParams.get("take") || 24);

  let items = MOCK.slice();

  if (category !== "Semua") items = items.filter(n => n.category === category);
  if (region !== "Semua") items = items.filter(n => n.region === region);

  if (q) {
    items = items.filter(n =>
      [n.title, n.description, n.source]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json({ items: items.slice(0, take) });
}
