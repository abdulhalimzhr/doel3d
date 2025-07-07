export default function SettingsPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">⚙️ Pengaturan</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Atur preferensi aplikasi dan parameter default untuk
          estimasi.
        </p>

        <div className="bg-muted p-8 rounded-xl text-center">
          <div className="text-4xl mb-4">🛠️</div>
          <h2 className="text-xl font-semibold mb-2">
            Pengaturan Akan Segera Hadir
          </h2>
          <p className="text-muted-foreground">
            Fitur pengaturan sedang dalam pengembangan untuk
            memberikan kontrol yang lebih baik atas parameter
            estimasi.
          </p>
        </div>
      </div>
    </div>
  );
}
