import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

// Mock StarField (canvas/animation)
vi.mock('@/components/StarField', () => ({
  default: () => <div data-testid="star-field" />,
}));

// Mock framer-motion (skip animations)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
  },
}));

// Mock useAppLogin
const mockLogin = vi.fn();
vi.mock('@/hooks/useAppLogin', () => ({
  useAppLogin: () => ({ login: mockLogin, loading: false }),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import IntroPage from '@/pages/IntroPage';

describe('IntroPage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  afterEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('renders app name and CTA button', () => {
    render(<MemoryRouter><IntroPage /></MemoryRouter>);
    expect(screen.getByText('코어 메모리')).toBeTruthy();
    expect(screen.getByRole('button', { name: /시작하기/i })).toBeTruthy();
  });

  it('calls login and sets intro_seen on success', async () => {
    mockLogin.mockResolvedValue({ appToken: 'fake-token' });
    render(<MemoryRouter><IntroPage /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: /시작하기/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledOnce());
    await waitFor(() => expect(localStorage.getItem('intro_seen')).toBe('1'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }));
  });

  it('does NOT set intro_seen or navigate when login fails', async () => {
    mockLogin.mockResolvedValue(null);
    render(<MemoryRouter><IntroPage /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: /시작하기/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledOnce());
    expect(localStorage.getItem('intro_seen')).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
