import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders App component', () => {
    render(<App />);

    screen.getByRole('heading', { level: 1, name: /FE exercise/ });
    screen.getByRole('button', { name: /count is/ });
  });

  it('increments the count value', async () => {
    const user = userEvent.setup();
    render(<App />);
    const btn = screen.getByRole('button', { name: /count is/ });

    expect(btn).toHaveTextContent('count is 0');

    await user.click(btn);

    expect(btn).toHaveTextContent('count is 1');
  });
});
