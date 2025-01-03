import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Alert } from '@mui/material';
import { Header } from './Header/Header.tsx';
import { Footer } from './Footer/Footer.tsx';
import { DateControls } from './DateControls/DateControls.tsx';
import { Chart } from './Chart/Chart.tsx';
import { DataType, ChartData, DateValidationError } from './types';
import { validateDates } from './utils/dateValidation.ts';
import { processChartData } from './utils/chartData.ts';
import { setupChartJs } from './utils/chartSetup.ts';
import "./App.css";

setupChartJs();

const App = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [dataType, setDataType] = useState<DataType>('actual');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<DateValidationError>({});

  const handleFromDateChange = (date: Date | null) => {
    setFromDate(date);
    setValidationErrors({});
    setError('');
    setChartData(null);
  };

  const handleToDateChange = (date: Date | null) => {
    setToDate(date);
    setValidationErrors({});
    setError('');
    setChartData(null);
  };

  const handleTypeChange = (type: DataType) => {
    setDataType(type);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!fromDate || !toDate) return;

      const errors = validateDates(fromDate, toDate);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      setError('');
      setValidationErrors({});

      try {
        const response = await fetch(
          `https://api.carbonintensity.org.uk/intensity/${fromDate.toISOString()}/${toDate.toISOString()}`
        );
        const data = await response.json();
        setChartData(processChartData(data, dataType));
      } catch {
        setError('Failed to fetch data. Please try again.');
      }
    };

    if (fromDate && toDate) {
      const errors = validateDates(fromDate, toDate);
      setValidationErrors(errors);
      
      if (Object.keys(errors).length > 0) {
        setChartData(null);
        return;
      }

      fetchData();
    }
  }, [fromDate, toDate, dataType]);


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="app-container">
        <Header />        
        <main className="main-content">
          <div className="content-wrapper">
            <h2 className="section-title">Carbon Intensity Analysis</h2>
            <DateControls 
              fromDate={fromDate}
              toDate={toDate}
              dataType={dataType}
              onFromChange={handleFromDateChange}
              onToChange={handleToDateChange}
              onTypeChange={handleTypeChange}
              validationErrors={validationErrors}
            />
            
            {error && (
              <div className="error-message">
                <Alert severity="error">{error}</Alert>
              </div>
            )}
            
            <Chart data={chartData} />
          </div>
        </main>
        <Footer />
      </div>
    </LocalizationProvider>
  );
};

export default App;