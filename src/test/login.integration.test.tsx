import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

vi.mock('@apps-in-toss/web-framework', () => ({
  appLogin: async () => ({ authorizationCode: 'fake-auth-code' }),
}));

// Mock the supabase client module before importing app code
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: { invoke: async () => ({ data: { appToken: 'fake-app-token', user: { name: 'Test User' } }, error: null }) },
    auth: { signOut: async () => {} },
  },
}));

import LoginButton from '@/components/LoginButton';

describe('Login flow (integration - mock)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('performs login and stores app token', async () => {
    render(<LoginButton />);

    const btn = screen.getByRole('button', { name: /로그인|로딩 중/i });
    fireEvent.click(btn);

    await waitFor(() => expect(localStorage.getItem('app_token')).toBe('fake-app-token'));

    // After login, button should show logged-in state (로그인됨)
    await waitFor(() => expect(screen.getByText(/로그인됨|Test User/i)).toBeTruthy());
  });
});
