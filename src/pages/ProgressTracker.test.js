import { render, screen } from '@testing-library/react';
import ProgressTracker from './ProgressTracker';

test('renders ProgressTracker component', () => {
  render(<ProgressTracker />);
  const progressText = screen.getByText(/Week 1/i); 
  expect(progressText).toBeInTheDocument();
});
