'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      {/* Hero */}
      <section className="pt-20 pb-16 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          🎯 Doel3D — Estimasi Biaya Cetak STL
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          Upload file STL kamu, atur konfigurasi print, dan lihat
          estimasi biaya secara instan sebelum kamu order di
          Tokopedia.
        </p>

        <Button
          asChild
          className="text-lg px-8 py-6"
        >
          <Link href="/estimate">📦 Mulai Estimasi</Link>
        </Button>
      </section>

      {/* Features */}
      <section className="bg-muted py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-center">
          <Feature
            title="Upload STL Instan"
            desc="Cukup upload file .stl, sistem kami akan menghitung volume dan berat model secara otomatis."
          />
          <Feature
            title="Simulasi Akurat"
            desc="Estimasi berdasarkan parameter print asli seperti layer height, infill, dan nozzle size."
          />
          <Feature
            title="Langsung Order Tokopedia"
            desc="Setelah estimasi, kamu bisa langsung checkout via Tokopedia dengan data dan link yang sudah disiapkan."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-4 text-muted-foreground">
        © {new Date().getFullYear()} Doel3D. Dibuat dengan 💙 oleh
        kamu.
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-background p-6 rounded-xl shadow-sm border">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
