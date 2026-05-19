import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UnlinkCallback from '@/pages/UnlinkCallback';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { signOut: async () => {} },
    functions: { invoke: async () => ({ data: null, error: null }) },
  },
}));

describe('Unlink callback', () => {
  beforeEach(() => {
    localStorage.setItem('app_token', 'token');
    localStorage.setItem('app_user', JSON.stringify({ name: 'Test' }));
  });

  it('clears local storage and redirects to /', async () => {
    render(
      <MemoryRouter initialEntries={["/unlink"]}>
        <Routes>
          <Route path="/unlink" element={<UnlinkCallback />} />
          <Route path="/" element={<div data-testid="home">home</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(localStorage.getItem('app_token')).toBeNull());
  });
});
