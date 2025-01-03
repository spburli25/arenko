import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import { ToggleButtonGroup, ToggleButton, Alert } from '@mui/material';
import dayjs from 'dayjs';
import { DataType, DateValidationError } from '../types';
import "./DateControls.css";

interface DateControlsProps {
  fromDate: Date | null;
  toDate: Date | null;
  dataType: DataType;
  onFromChange: (date: Date | null) => void;
  onToChange: (date: Date | null) => void;
  onTypeChange: (type: DataType) => void;
  validationErrors: DateValidationError;
}

export const DateControls: React.FC<DateControlsProps> = ({
  fromDate,
  toDate,
  dataType,
  onFromChange,
  onToChange,
  onTypeChange,
  validationErrors
}) => {
  return (
    <div className="datecontrols-container">
      <div className="datecontrols-wrapper">
        <div className="date-picker-container">
          <DateTimePicker
            label="From"
            value={fromDate ? dayjs(fromDate) : null}
            onChange={(newValue) => onFromChange(newValue ? newValue.toDate() : null)}
            className="date-picker"
            maxDateTime={dayjs()}
            views={['year', 'month', 'day', 'hours', 'minutes']}
            format="DD/MM/YYYY HH:mm"
            ampm={false}
            slotProps={{
              textField: {
                error: !!validationErrors.fromDate,
                helperText: validationErrors.fromDate
              }
            }}
          />
        </div>

        <div className="date-picker-container">
          <DateTimePicker
            label="To"
            value={toDate ? dayjs(toDate) : null}
            onChange={(newValue) => onToChange(newValue ? newValue.toDate() : null)}
            className="date-picker"
            maxDateTime={dayjs()}
            views={['year', 'month', 'day', 'hours', 'minutes']}
            format="DD/MM/YYYY HH:mm"
            ampm={false}
            slotProps={{
              textField: {
                error: !!validationErrors.toDate,
                helperText: validationErrors.toDate
              }
            }}
          />
        </div>

        <ToggleButtonGroup
          value={dataType}
          exclusive
          onChange={(_, newValue: DataType) => newValue && onTypeChange(newValue)}
          className="toggle-group"
        >
          <ToggleButton value="actual">Actual</ToggleButton>
          <ToggleButton value="forecast">Forecast</ToggleButton>
          <ToggleButton value="both">Both</ToggleButton>
        </ToggleButtonGroup>
      </div>

      {validationErrors.dateRange && (
        <div className="validation-error">
          <Alert severity="error">{validationErrors.dateRange}</Alert>
        </div>
      )}
    </div>
  );
};