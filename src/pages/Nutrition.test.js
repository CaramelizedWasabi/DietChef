// src/pages/Nutrition.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Nutrition from './Nutrition'; 
import { BrowserRouter } from 'react-router-dom';


describe('Nutrition Page', () => {
  test('renders Nutrition page and shows nutrient info', async () => {
    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Calories/i)).toBeInTheDocument();
      expect(screen.getByText(/Carbohydrates/i)).toBeInTheDocument();
      expect(screen.getByText(/Protein/i)).toBeInTheDocument();
    });
  });

  test('has navigation link to Nutrition Analysis page', async () => {
    render(
      <BrowserRouter>
        <Nutrition />
      </BrowserRouter>
    );

    const link = screen.getByRole('link', {
      name: /Nutrition/i
    });

    expect(link).toHaveAttribute('href', '/nutrition-analysis');
  });
});
