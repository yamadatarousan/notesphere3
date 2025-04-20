import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders Hello, Tailwind CSS!', () => {
    render(<Home />);
    expect(screen.getByText('Hello, Tailwind CSS!')).toBeInTheDocument();
  });
});