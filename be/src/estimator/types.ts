export interface EstimateResult {
  filename: string;
  volume: number; // mm³
  weight: number; // grams
  materialCost: number; // IDR
  timeInHours: number;
  timeCost: number; // IDR
  totalCost: number; // IDR
}
