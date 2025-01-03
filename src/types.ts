export type DataType = 'actual' | 'forecast' | 'both';

export interface DateValidationError {
  fromDate?: string;
  toDate?: string;
  dateRange?: string;
}

export interface ChartData {
  datasets: {
    label: string;
    data: { x: number; y: number }[];
    borderColor: string;
    tension: number;
  }[];
}

export interface ApiSuccessResponse {
  data: {
    from: string;
    intensity: {
      actual: number;
      forecast: number;
    };
  }[];
}

export interface ApiErrorResponse {
  error: {
    message: string;
  };
}