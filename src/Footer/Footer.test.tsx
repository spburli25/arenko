import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders footer with copyright and current year', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    const footerText = screen.getByText(new RegExp(`© ${currentYear} Carbon Intensity Analysis`));
    expect(footerText).toBeInTheDocument();
  });
});