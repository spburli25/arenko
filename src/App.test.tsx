import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import App from './App';

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Alert: ({ children, severity, className }: { children: React.ReactNode; severity: string; className?: string }) => (
      <div role="alert" data-severity={severity} className={className}>
        <div className="MuiAlert-message">{children}</div>
      </div>
    ),
  };
});

vi.mock('@mui/x-date-pickers', () => ({
  DatePicker: ({ label, onChange, value, className }: { label: string; onChange: (date: dayjs.Dayjs | null) => void; value: dayjs.Dayjs | null; className?: string }) => (
    <div className={className}>
      <label>{label}</label>
      <input
        type="text"
        data-testid={`${label}-datepicker`}
        value={value ? value.format('MM/DD/YYYY') : ''}
        onChange={(e) => {
          const date = dayjs(e.target.value);
          if (date.isValid()) {
            onChange(date);
          }
        }}
      />
    </div>
  ),
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App', () => {
  const mockFetch = vi.fn();
  const mockResponse = {
    data: [
      { from: '2024-01-01T00:00Z', to: '2024-01-01T00:30Z', intensity: { actual: 200, forecast: 180 } }
    ]
  };

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const renderApp = () => {
    return render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
      </LocalizationProvider>
    );
  };

  it('renders main components', () => {
    renderApp();
    expect(screen.getByText('Carbon Intensity Monitoring System')).toBeInTheDocument();
    expect(screen.getByText('Carbon Intensity Analysis')).toBeInTheDocument();
  });

  it('handles date changes and validates', async () => {
    const user = userEvent.setup();
    renderApp();
    
    const fromInput = screen.getByTestId('From-datepicker');
    const toInput = screen.getByTestId('To-datepicker');

    await user.clear(fromInput);
    await user.type(fromInput, '01/01/2024');
    await user.clear(toInput);
    await user.type(toInput, '01/02/2024');

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    }, { timeout: 3000 });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('carbonintensity.org.uk/intensity/')
    );
  });

});