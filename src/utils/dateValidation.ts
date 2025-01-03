import { DateValidationError } from '../types';

export const validateDates = (fromDate: Date | null, toDate: Date | null): DateValidationError => {
  const errors: DateValidationError = {};

  if (fromDate && toDate) {
    const timeDiffMinutes = (toDate.getTime() - fromDate.getTime()) / (1000 * 60);    
    if (timeDiffMinutes <= 0) {
      errors.dateRange = "Start datetime must be before end datetime";
    } else {
      const daysDiff = timeDiffMinutes / (60 * 24);
      if (daysDiff > 14) {
        errors.dateRange = "Date range cannot exceed 14 days";
      }
    }
  }
  return errors;
};