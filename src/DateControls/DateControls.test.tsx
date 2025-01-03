import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateControls } from './DateControls';

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Alert: ({ children, severity }: { children: React.ReactNode; severity: string }) => (
      <div role="alert" data-severity={severity}>{children}</div>
    ),
    ToggleButtonGroup: ({ children, value, onChange }: { children: React.ReactNode; value: string; onChange: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void }) => (
      <div role="group" data-value={value} onClick={onChange}>{children}</div>
    ),
    ToggleButton: ({ children, value }: { children: React.ReactNode; value: string }) => (
      <button role="button" data-value={value}>{children}</button>
    ),
  };
});

vi.mock('@mui/x-date-pickers', () => ({
  DateTimePicker: ({ label, onChange, value, className }: { label: string; onChange: (date: dayjs.Dayjs) => void; value: dayjs.Dayjs | null; className?: string }) => (
    <div className={className}>
      <label>{label}</label>
      <input
        type="text"
        data-testid={`${label}-datetime-picker`}
        value={value ? value.format('DD/MM/YYYY HH:mm') : ''}
        onChange={(e) => {
          const date = dayjs(e.target.value, 'DD/MM/YYYY HH:mm');
          if (date.isValid()) {
            onChange(date);
          }
        }}
      />
    </div>
  ),
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('DateControls', () => {
  const mockProps = {
    fromDate: null,
    toDate: null,
    dataType: 'actual' as const,
    onFromChange: vi.fn(),
    onToChange: vi.fn(),
    onTypeChange: vi.fn(),
    validationErrors: {}
  };

  const renderDateControls = (props = mockProps) => {
    return render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateControls {...props} />
      </LocalizationProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders datetime pickers and toggle buttons', () => {
    renderDateControls();
    expect(screen.getByTestId('From-datetime-picker')).toBeInTheDocument();
    expect(screen.getByTestId('To-datetime-picker')).toBeInTheDocument();
    expect(screen.getByText(/actual/i)).toBeInTheDocument();
    expect(screen.getByText(/forecast/i)).toBeInTheDocument();
  });

  it('shows validation errors when present', () => {
    renderDateControls({
      ...mockProps,
      validationErrors: {
        dateRange: 'Invalid date range'
      }
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid date range');
  });

  it('handles datetime changes', async () => {
    const user = userEvent.setup();
    renderDateControls();

    const fromInput = screen.getByTestId('From-datetime-picker');
    
    await user.clear(fromInput);
    await user.type(fromInput, '01/01/2024 09:30');
    
    await waitFor(() => {
      expect(mockProps.onFromChange).toHaveBeenCalled();
    });
  });

  it('handles invalid datetime input', async () => {
    const user = userEvent.setup();
    renderDateControls();

    const fromInput = screen.getByTestId('From-datetime-picker');
    
    await user.clear(fromInput);
    await user.type(fromInput, 'invalid date');
    
    await waitFor(() => {
      expect(mockProps.onFromChange).not.toHaveBeenCalled();
    });
  });
});