import React from 'react';
import { render, screen } from '@testing-library/react';
import { FilterBar } from './filter-bar';

describe('FilterBar', () => {
  it('renders children correctly', () => {
    render(
      <FilterBar>
        <div>Test Child</div>
      </FilterBar>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <FilterBar title="Test Title">
        <div>Test Child</div>
      </FilterBar>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    render(
      <FilterBar>
        <div>Test Child</div>
      </FilterBar>
    );
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(
      <FilterBar className="custom-class">
        <div>Test Child</div>
      </FilterBar>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
