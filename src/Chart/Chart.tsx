import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData } from '../types';
import "./Chart.css";

interface ChartProps {
  data: ChartData | null;
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  if (!data) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'hour' as const,
          displayFormats: {
            hour: 'MMM d, HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Carbon Intensity (gCO2/kWh)",
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          title: (context: { parsed: { x: number } }[]) => {
            return new Date(context[0].parsed.x).toLocaleString();
          }
        }
      },
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};