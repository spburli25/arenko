import { DateValidationError } from '../types';

export const validateDates = (fromDate: Date | null, toDate: Date | null): DateValidationError => {
    const errors: DateValidationError = {};
  
    if (fromDate && toDate) {
      if (fromDate > toDate) {
        errors.dateRange = "Start date must be before end date";
      } else {
        const daysDiff = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff > 14) {
          errors.dateRange = "Date range cannot exceed 14 days";
        }
      }
    }  
    return errors;
  };