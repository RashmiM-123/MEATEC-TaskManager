import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from './Dashboard';
import { AuthProvider } from '../context/AuthContext';

describe('Dashboard Component', () => {
  it('renders the dashboard and shows the "New Task" button', () => {
    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Your Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/New Task/i)).toBeInTheDocument();
  });

  it('opens the modal when "New Task" is clicked', async () => {
    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    );

    const addButton = screen.getByText(/New Task/i);
    fireEvent.click(addButton);

    expect(screen.getByText(/Create New Task/i)).toBeInTheDocument();
  });
});