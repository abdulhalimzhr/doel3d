import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Hubungi Kami</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Ada pertanyaan tentang estimasi cetak 3D? Kami siap membantu
          Anda.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Kirim Pesan
            </h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  placeholder="Nama lengkap Anda"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subjek</Label>
                <Input
                  id="subject"
                  placeholder="Subjek pesan"
                />
              </div>
              <div>
                <Label htmlFor="message">Pesan</Label>
                <textarea
                  id="message"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tulis pesan Anda di sini..."
                />
              </div>
              <Button
                type="submit"
                className="w-full"
              >
                Kirim Pesan
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Informasi Kontak
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📧</div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">
                    support@doel3d.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-2xl">💬</div>
                <div>
                  <h3 className="font-semibold">WhatsApp</h3>
                  <p className="text-muted-foreground">
                    +62 812-3456-7890
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-2xl">🕒</div>
                <div>
                  <h3 className="font-semibold">Jam Operasional</h3>
                  <p className="text-muted-foreground">
                    Senin - Jumat: 09:00 - 18:00 WIB
                    <br />
                    Sabtu: 09:00 - 15:00 WIB
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-2xl">🛒</div>
                <div>
                  <h3 className="font-semibold">Tokopedia</h3>
                  <p className="text-muted-foreground">
                    <a
                      href="https://tokopedia.com/doel3d"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      tokopedia.com/doel3d
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-muted rounded-xl">
              <h3 className="font-semibold mb-2">💡 Tips</h3>
              <p className="text-sm text-muted-foreground">
                Untuk pertanyaan teknis tentang file STL atau
                parameter cetak, sertakan detail model dan spesifikasi
                yang diinginkan agar kami dapat memberikan bantuan
                yang lebih tepat.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
