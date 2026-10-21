import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../src/components/common/Header';
import { Badge } from '../src/components/common/Badge';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';

describe('Web UI Components', () => {
  it('renders Header with luxury brand title and links', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Header />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Haven/i)).toBeDefined();
    expect(screen.getByText(/Hearth/i)).toBeDefined();
    expect(screen.getByText(/Dining & Bars/i)).toBeDefined();
    expect(screen.getByText(/Boutique Stays/i)).toBeDefined();
  });

  it('renders Badge with correct variant styling', () => {
    const { container } = render(<Badge variant="success">Confirmed</Badge>);
    expect(screen.getByText('Confirmed')).toBeDefined();
    expect(container.firstChild).toHaveClass('bg-emerald-100');
  });
});
