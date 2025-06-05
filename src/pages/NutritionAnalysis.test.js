import { render, screen } from '@testing-library/react';
import NutritionAnalysis from './NutritionAnalysis';

test('renders NutritionAnalysis component', () => {
  render(<NutritionAnalysis />);
  const heading = screen.getByText(/analysis/i); 
  expect(heading).toBeInTheDocument();
});
