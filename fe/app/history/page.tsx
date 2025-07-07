export default function HistoryPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">📋 Riwayat Order</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Lihat riwayat estimasi dan pemesanan cetak 3D yang pernah
          Anda buat.
        </p>

        <div className="bg-muted p-8 rounded-xl text-center">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">
            Belum Ada Riwayat
          </h2>
          <p className="text-muted-foreground mb-4">
            Anda belum melakukan estimasi atau pemesanan apapun.
          </p>
          <a
            href="/estimate"
            className="text-primary hover:underline"
          >
            Mulai Estimasi Pertama →
          </a>
        </div>
      </div>
    </div>
  );
}
