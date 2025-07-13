'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calculator, FileText, Clock, DollarSign, Package } from 'lucide-react';
import { EstimationResult, formatCurrency, formatTime, formatWeight } from '@/lib/api-service';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<EstimationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get results from URL search params (passed from the estimate page)
    const resultsParam = searchParams.get('results');
    
    if (resultsParam) {
      try {
        const parsedResults = JSON.parse(decodeURIComponent(resultsParam));
        setResults(parsedResults);
      } catch (error) {
        console.error('Error parsing results:', error);
      }
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-red-600">
            ❌ Hasil Tidak Ditemukan
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Tidak ada hasil estimasi yang ditemukan. Silakan lakukan estimasi terlebih dahulu.
          </p>
          <Button asChild>
            <Link href="/estimate">
              Kembali ke Estimasi
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            ✅ Hasil Estimasi Cetak 3D
          </h1>
          <p className="text-lg text-muted-foreground">
            Estimasi biaya untuk file <span className="font-semibold">{results.filename}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* File Information */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Informasi File
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama File:</span>
                  <span className="font-medium">{results.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume:</span>
                  <span className="font-medium">{(results.volume / 1000).toFixed(2)} cm³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Berat Estimasi:</span>
                  <span className="font-medium">{formatWeight(results.weight)}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                Waktu Cetak
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimasi Waktu:</span>
                  <span className="font-medium text-green-700">{formatTime(results.timeInHours)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biaya Waktu:</span>
                  <span className="font-medium">{formatCurrency(results.timeCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-orange-600" />
                Biaya Material
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biaya Material:</span>
                  <span className="font-medium">{formatCurrency(results.materialCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biaya Waktu:</span>
                  <span className="font-medium">{formatCurrency(results.timeCost)}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
                Total Biaya
              </h2>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700 mb-2">
                  {formatCurrency(results.totalCost)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Sudah termasuk biaya material dan waktu cetak
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/estimate">
              <Calculator className="h-4 w-4 mr-2" />
              Estimasi Lain
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="https://tokopedia.com/doel3d" target="_blank" rel="noopener noreferrer">
              <Package className="h-4 w-4 mr-2" />
              Order di Tokopedia
            </Link>
          </Button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">📋 Catatan Penting:</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Estimasi ini berdasarkan parameter yang Anda pilih</li>
            <li>• Biaya dapat berubah sesuai dengan kondisi material dan ketersediaan</li>
            <li>• Waktu cetak dapat bervariasi tergantung antrian dan tingkat kesulitan</li>
            <li>• Untuk model kompleks, mungkin diperlukan support struktur tambahan</li>
          </ul>
        </div>

        <div className="text-center mt-8">
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
