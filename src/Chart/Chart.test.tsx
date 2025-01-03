import { render, screen } from '@testing-library/react';
import { Chart } from './Chart';

vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-chart">Chart Component</div>
}));

describe('Chart', () => {
  const mockData = {
    labels: ['2024-01-01', '2024-01-02'],
    datasets: [
      {
        label: 'Actual',
        data: [{ x: 0, y: 100 }, { x: 1, y: 150 }],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  it('renders nothing when no data is provided', () => {
    render(<Chart data={null} />);
    expect(screen.queryByTestId('mock-chart')).not.toBeInTheDocument();
  });

  it('renders chart when data is provided', () => {
    render(<Chart data={mockData} />);
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
  });
});