import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Tentang Doel3D</h1>

        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Doel3D adalah platform estimasi biaya cetak 3D yang
            membantu Anda menghitung biaya secara akurat sebelum
            melakukan pemesanan.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                🎯 Misi Kami
              </h2>
              <p className="text-muted-foreground">
                Menyediakan solusi estimasi biaya cetak 3D yang
                transparan dan akurat untuk membantu maker, designer,
                dan hobbyist membuat keputusan yang tepat.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                ⚡ Keunggulan
              </h2>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  • Estimasi real-time berdasarkan parameter print
                </li>
                <li>• Integrasi langsung dengan Tokopedia</li>
                <li>• Analisis volume dan kompleksitas model STL</li>
                <li>• Transparansi harga tanpa biaya tersembunyi</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">
              🚀 Cara Kerja
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">📤</div>
                <h3 className="font-semibold mb-2">1. Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload file STL Anda
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="font-semibold mb-2">2. Konfigurasi</h3>
                <p className="text-sm text-muted-foreground">
                  Atur parameter cetak
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold mb-2">3. Estimasi</h3>
                <p className="text-sm text-muted-foreground">
                  Dapatkan estimasi biaya
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/estimate"
            className="text-primary hover:underline"
          >
            Mulai Estimasi Sekarang →
          </Link>
        </div>
      </div>
    </div>
  );
}
