import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import App from './App';

vi.mock('@mui/x-date-pickers', () => ({
  DateTimePicker: ({ label, onChange }: { label: string; onChange: (date: dayjs.Dayjs | null) => void }) => (
    <input
      data-testid={`${label}-datetime-picker`}
      onChange={(e) => onChange(dayjs(e.target.value))}
    />
  ),
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Alert: ({ children }: { children: React.ReactNode }) => <div role="alert">{children}</div>,
    ToggleButtonGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ToggleButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  };
});

describe('App', () => {

  it('renders main components', () => {
    render(<App />);
    expect(screen.getByText('Carbon Intensity Monitoring System')).toBeInTheDocument();
    expect(screen.getByText('Carbon Intensity Analysis')).toBeInTheDocument();
  });
  it('handles datetime changes and validates', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        redirected: false,
        json: () => Promise.resolve({ data: [] }),
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve('')
      } as Response)
    );
    global.fetch = mockFetch;

    render(<App />);
    
    const fromInput = screen.getByTestId('From-datetime-picker');
    const toInput = screen.getByTestId('To-datetime-picker');

    const targetDate = dayjs('2024-01-01T09:00:00');
    await userEvent.type(fromInput, targetDate.format());
    
    const endDate = dayjs('2024-01-01T10:00:00');
    await userEvent.type(toInput, endDate.format());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it('shows error for invalid datetime range', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const fromInput = screen.getByTestId('From-datetime-picker');
    const toInput = screen.getByTestId('To-datetime-picker');

    await user.clear(fromInput);
    await user.type(fromInput, '01/01/2024 10:00');
    await user.clear(toInput);
    await user.type(toInput, '01/01/2024 09:00');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Start datetime must be before end datetime');
    });
  });
});