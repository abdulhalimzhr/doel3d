'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Loader2, X } from 'lucide-react';
import {
  ApiService,
  type PrintSettingsInput
} from '@/lib/api-service';
import { useRouter } from 'next/navigation';

// Types
interface UploadedFile {
  file: File;
  name: string;
  size: number;
  url: string;
}

interface PrintConfig {
  material: string;
  layerHeight: string;
  infill: string;
  wallThickness: string;
  supportStructure: boolean;
}

export default function EstimatePage() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] =
    useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'config'>(
    'upload'
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [printConfig, setPrintConfig] = useState<PrintConfig>({
    material: '',
    layerHeight: '',
    infill: '',
    wallThickness: '',
    supportStructure: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert PrintConfig to PrintSettingsInput
  const convertConfigToInput = (
    config: PrintConfig
  ): PrintSettingsInput => {
    // Convert wall thickness (mm) to wall count (number of walls)
    // Assuming 0.4mm nozzle width, each wall is approximately 0.4mm
    const wallThickness = parseFloat(config.wallThickness) || 0.8;
    const wallCount = Math.round(wallThickness / 0.4);
    
    return {
      layerHeight: parseFloat(config.layerHeight) || 0.2,
      wallCount: wallCount,
      topLayerCount: 3,
      bottomLayerCount: 3,
      infillPercentage: parseFloat(config.infill) || 20,
      material: config.material === 'PETG' ? 'PETG' : 'PLA',
      nozzleWidth: 0.4,
      printSpeed: 60,
      density: config.material === 'PETG' ? 1.27 : 1.24
    };
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.stl')) {
      alert('Hanya file STL yang diperbolehkan');
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Ukuran file maksimal 50MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create object URL for file preview
      const url = URL.createObjectURL(file);

      const uploadedFile: UploadedFile = {
        file,
        name: file.name,
        size: file.size,
        url
      };

      setUploadedFile(uploadedFile);
      setCurrentStep('config');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Gagal mengupload file. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Handle drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // Handle click upload
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle remove file
  const handleRemoveFile = useCallback(() => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    setCurrentStep('upload');
    setPrintConfig({
      material: '',
      layerHeight: '',
      infill: '',
      wallThickness: '',
      supportStructure: false
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadedFile]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!uploadedFile) return;

    setIsCalculating(true);

    try {
      // Convert config to match GraphQL schema
      const apiSettings = convertConfigToInput(printConfig);

      // Call the API service to estimate print cost
      const result = await ApiService.estimatePrintCost(
        uploadedFile.file,
        apiSettings
      );

      // Navigate to results page with the estimation data
      const resultsParam = encodeURIComponent(JSON.stringify(result));
      router.push(`/results?results=${resultsParam}`);
    } catch (error) {
      console.error('Error calculating estimate:', error);
      alert('Gagal menghitung estimasi. Silakan coba lagi.');
    } finally {
      setIsCalculating(false);
    }
  };

  if (currentStep === 'upload') {
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

          <div
            className={`border-2 border-dashed rounded-lg p-12 mb-8 transition-colors cursor-pointer ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <div className="text-center">
              {isUploading ? (
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
              ) : (
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
              )}
              <p className="mt-4 text-sm text-muted-foreground">
                {isUploading
                  ? 'Mengupload file...'
                  : 'Klik untuk upload atau drag & drop file STL di sini'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Format yang didukung: .stl (maksimal 50MB)
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".stl"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <Button
            size="lg"
            className="mb-4"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File STL
              </>
            )}
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

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            ⚙️ Konfigurasi Cetak 3D
          </h1>
          <p className="text-lg text-muted-foreground">
            Atur parameter cetak untuk mendapatkan estimasi biaya yang
            akurat
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* File Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              📄 File yang Diupload
            </h2>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">
                      {uploadedFile?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadedFile?.size || 0)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* STL Preview Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    File STL siap untuk diproses
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detail file akan dianalisis oleh backend
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              ⚙️ Konfigurasi Cetak
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="material">Material</Label>
                <Select
                  value={printConfig.material}
                  onValueChange={(value) =>
                    setPrintConfig((prev) => ({
                      ...prev,
                      material: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pla">PLA</SelectItem>
                    <SelectItem value="petg">PETG</SelectItem>
                    <SelectItem value="abs">ABS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="layerHeight">Layer Height</Label>
                <Select
                  value={printConfig.layerHeight}
                  onValueChange={(value) =>
                    setPrintConfig((prev) => ({
                      ...prev,
                      layerHeight: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih layer height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">
                      0.1mm (High Quality)
                    </SelectItem>
                    <SelectItem value="0.2">
                      0.2mm (Standard)
                    </SelectItem>
                    <SelectItem value="0.3">0.3mm (Draft)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="infill">Infill</Label>
                <Select
                  value={printConfig.infill}
                  onValueChange={(value) =>
                    setPrintConfig((prev) => ({
                      ...prev,
                      infill: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih infill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="wallThickness">Wall Thickness</Label>
                <Select
                  value={printConfig.wallThickness}
                  onValueChange={(value) =>
                    setPrintConfig((prev) => ({
                      ...prev,
                      wallThickness: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih ketebalan dinding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.8">0.8mm (2 walls)</SelectItem>
                    <SelectItem value="1.2">1.2mm (3 walls)</SelectItem>
                    <SelectItem value="1.6">1.6mm (4 walls)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="supportStructure"
                  checked={printConfig.supportStructure}
                  onChange={(e) =>
                    setPrintConfig((prev) => ({
                      ...prev,
                      supportStructure: e.target.checked
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="supportStructure">
                  Support Structure
                </Label>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleRemoveFile}
                className="flex-1"
              >
                Ganti File
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isCalculating ||
                  !printConfig.material ||
                  !printConfig.layerHeight ||
                  !printConfig.infill ||
                  !printConfig.wallThickness
                }
                className="flex-1"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menghitung...
                  </>
                ) : (
                  'Hitung Estimasi'
                )}
              </Button>
            </div>
          </div>
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
