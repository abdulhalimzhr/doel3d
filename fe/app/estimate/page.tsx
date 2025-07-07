import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EstimatePage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          📦 Estimasi Biaya Cetak 3D
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Upload file STL Anda dan dapatkan estimasi biaya cetak 3D
          yang akurat dalam hitungan detik.
        </p>

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 mb-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground/50"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-4 text-sm text-muted-foreground">
              Klik untuk upload atau drag & drop file STL di sini
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Format yang didukung: .stl (maksimal 50MB)
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="mb-4"
        >
          Upload File STL
        </Button>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
