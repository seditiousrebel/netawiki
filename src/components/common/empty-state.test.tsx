import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './empty-state';
import { UsersIcon } from 'lucide-react'; // Example icon

describe('EmptyState', () => {
  it('renders correctly with given props', () => {
    render(
      <EmptyState
        IconComponent={UsersIcon}
        title="No Items Found"
        message="There are no items to display."
      />
    );
    expect(screen.getByText('No Items Found')).toBeInTheDocument();
    expect(screen.getByText('There are no items to display.')).toBeInTheDocument();
    // Check if icon is rendered (difficult to check specific icon without more specific selectors)
    // For now, we assume if no error, icon is passed and rendered by EmptyState
    expect(document.querySelector('.lucide-users')).toBeInTheDocument(); // Example, depends on how lucide-react renders icons
  });

  it('applies additional className', () => {
    const { container } = render(
      <EmptyState
        IconComponent={UsersIcon}
        title="Test Title"
        message="Test Message"
        className="custom-empty-state-class"
      />
    );
    expect(container.firstChild).toHaveClass('custom-empty-state-class');
  });
});
