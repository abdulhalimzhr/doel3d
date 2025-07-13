import { apolloClient, handleGraphQLError } from './apollo-client';
import { ApolloError } from '@apollo/client';
import { 
  ESTIMATE_PRINT_COST, 
  LIST_UPLOADED_FILES,
  type EstimationResult,
  type PrintSettingsInput,
  type EstimatePrintCostResponse,
  type ListUploadedFilesResponse
} from './graphql/mutations';

// Re-export types for easier importing
export type { EstimationResult, PrintSettingsInput };

// Service for API calls
export class ApiService {
  /**
   * Estimate print cost by uploading STL file with settings
   */
  static async estimatePrintCost(
    file: File,
    settings: PrintSettingsInput
  ): Promise<EstimationResult> {
    try {
      const { data } =
        await apolloClient.mutate<EstimatePrintCostResponse>({
          mutation: ESTIMATE_PRINT_COST,
          variables: {
            file,
            settings
          }
        });

      if (!data?.estimatePrintCost) {
        throw new Error('No data received from server');
      }

      return data.estimatePrintCost;
    } catch (error) {
      console.error('Error estimating print cost:', error);
      const errorMessage = handleGraphQLError(error as ApolloError);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get list of uploaded files
   */
  static async listUploadedFiles(): Promise<string[]> {
    try {
      const { data } =
        await apolloClient.query<ListUploadedFilesResponse>({
          query: LIST_UPLOADED_FILES,
          fetchPolicy: 'no-cache' // Always fetch fresh data
        });

      return data?.listUploadedFiles || [];
    } catch (error) {
      console.error('Error listing uploaded files:', error);
      throw error;
    }
  }
}

// Utility function to convert form data to backend format
export const convertFormToPrintSettings = (formData: {
  material: string;
  layerHeight: string;
  infill: string;
  wallThickness: string;
  supportStructure: boolean;
}): PrintSettingsInput => {
  // Convert wall thickness to wall count (assuming 0.4mm nozzle)
  const wallThicknessValue = parseFloat(formData.wallThickness);
  const wallCount = Math.max(1, Math.round(wallThicknessValue / 0.4));

  return {
    layerHeight: parseFloat(formData.layerHeight),
    wallCount,
    topLayerCount: 3, // Default value
    bottomLayerCount: 3, // Default value
    infillPercentage: parseInt(formData.infill),
    material: formData.material.toUpperCase() as 'PLA' | 'PETG',
    nozzleWidth: 0.4, // Default nozzle width
    printSpeed: 210, // Default print speed
    density: 1.24 // Default PLA density
  };
};

// Utility function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Utility function to format time
export const formatTime = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} menit`;
  } else {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours} jam`;
    } else {
      return `${wholeHours} jam ${minutes} menit`;
    }
  }
};

// Utility function to format weight
export const formatWeight = (grams: number): string => {
  if (grams < 1000) {
    return `${grams.toFixed(1)} g`;
  } else {
    return `${(grams / 1000).toFixed(2)} kg`;
  }
};
