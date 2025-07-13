import { gql } from '@apollo/client';

// Mutation for estimating print cost
export const ESTIMATE_PRINT_COST = gql`
  mutation EstimatePrintCost($file: Upload!, $settings: PrintSettingsInput!) {
    estimatePrintCost(file: $file, settings: $settings) {
      filename
      volume
      weight
      materialCost
      timeInHours
      timeCost
      totalCost
    }
  }
`;

// Query for listing uploaded files
export const LIST_UPLOADED_FILES = gql`
  query ListUploadedFiles {
    listUploadedFiles
  }
`;

// TypeScript types for the GraphQL responses
export interface EstimationResult {
  filename: string;
  volume: number; // mm³
  weight: number; // grams
  materialCost: number; // in IDR
  timeInHours: number;
  timeCost: number;
  totalCost: number;
}

export interface PrintSettingsInput {
  layerHeight: number;
  wallCount: number;
  topLayerCount: number;
  bottomLayerCount: number;
  infillPercentage: number;
  material: 'PLA' | 'PETG';
  nozzleWidth?: number;
  printSpeed?: number;
  density?: number;
}

export interface EstimatePrintCostResponse {
  estimatePrintCost: EstimationResult;
}

export interface ListUploadedFilesResponse {
  listUploadedFiles: string[];
}
