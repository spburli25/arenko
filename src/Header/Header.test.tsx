import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders header with correct title', () => {
    render(<Header />);
    
    const heading = screen.getByRole('heading', { 
      level: 1, 
      name: /carbon intensity monitoring system/i 
    });
    expect(heading).toBeInTheDocument();
  });
});