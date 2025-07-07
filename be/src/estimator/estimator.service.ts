import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import { parseStlVolume } from '../utils/stl-parser';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { PrintSettingsInput } from '../upload/dto/print-settings.input';
import { EstimationResult } from '../upload/dto/estimation-result.output';

@Injectable()
export class EstimatorService {
  async estimate(
    file: FileUpload,
    settings: PrintSettingsInput,
  ): Promise<EstimationResult> {
    const { filename } = file;
    const savePath = join(process.cwd(), 'uploads', filename);

    // Save the file to /uploads
    await new Promise((resolve, reject) =>
      file
        .createReadStream()
        .pipe(createWriteStream(savePath))
        .on('finish', () => resolve(undefined))
        .on('error', reject),
    );

    // Parse STL volume
    const { volumeCm3 } = parseStlVolume(savePath);
    const volumeMm3 = volumeCm3 * 1000;

    const {
      layerHeight,
      wallCount,
      topLayerCount,
      bottomLayerCount,
      infillPercentage,
      material,
      nozzleWidth,
      printSpeed,
      density,
    } = settings;

    const materialDensity = material === 'PETG' ? 1.27 : density;
    const shellRatio = 0.3;
    const infillRatio = infillPercentage / 100;

    const shellVolume = volumeMm3 * shellRatio;
    const infillVolume = (volumeMm3 - shellVolume) * infillRatio;
    const effectiveVolume = shellVolume + infillVolume;

    const volumeEfficiency = 0.8;
    const calibratedVolume = effectiveVolume * volumeEfficiency;

    const weight = (calibratedVolume / 1000) * materialDensity;
    const pricePerGram = material === 'PLA' ? 220 : 350;
    const materialCost = Math.round(weight * pricePerGram);

    const extrusionVolumePerMm = nozzleWidth * layerHeight;
    const baseLength = calibratedVolume / extrusionVolumePerMm;
    const complexityMultiplier =
      1 + wallCount * 0.1 + (topLayerCount + bottomLayerCount) * 0.05;
    const adjustedLength = baseLength * complexityMultiplier;

    const totalSeconds = adjustedLength / printSpeed;
    const timeInHours = totalSeconds / 3600;
    const timeCost = Math.round(timeInHours * 10_000);
    const totalCost = materialCost + timeCost;

    return {
      filename,
      volume: Math.round(volumeMm3),
      weight: parseFloat(weight.toFixed(2)),
      materialCost,
      timeInHours: parseFloat(timeInHours.toFixed(2)),
      timeCost,
      totalCost,
    };
  }
}
