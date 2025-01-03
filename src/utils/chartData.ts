import { ApiSuccessResponse, ChartData, DataType } from '../types';

export const processChartData = (data: ApiSuccessResponse, dataType: DataType): ChartData => {
  const timestamps = data.data.map(d => new Date(d.from).getTime());
  const datasets = [];

  if (dataType === "actual" || dataType === "both") {
    datasets.push({
      label: 'Actual Intensity',
      data: data.data.map((d, i) => ({
        x: timestamps[i],
        y: d.intensity.actual
      })),
      borderColor: '#4caf50',
      tension: 0.1
    });
  }

  if (dataType === "forecast" || dataType === "both") {
    datasets.push({
      label: 'Forecast Intensity',
      data: data.data.map((d, i) => ({
        x: timestamps[i],
        y: d.intensity.forecast
      })),
      borderColor: '#2196f3',
      tension: 0.1
    });
  }

  return { datasets };
};