export default function ProfilePage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">👤 Profile</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Kelola informasi akun dan preferensi Anda.
        </p>

        <div className="bg-muted p-8 rounded-xl text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">
            Fitur Login Belum Tersedia
          </h2>
          <p className="text-muted-foreground">
            Sistem autentikasi sedang dalam pengembangan. Saat ini
            Anda dapat menggunakan semua fitur estimasi tanpa login.
          </p>
        </div>
      </div>
    </div>
  );
}
