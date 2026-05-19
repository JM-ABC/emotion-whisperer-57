import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

// Mock all page components so App.tsx imports don't cascade
vi.mock('@/pages/Index',        () => ({ default: () => <div>home</div> }));
vi.mock('@/pages/IntroPage',    () => ({ default: () => <div>intro</div> }));
vi.mock('@/pages/WritePage',    () => ({ default: () => <div>write</div> }));
vi.mock('@/pages/InsightPage',  () => ({ default: () => <div>insight</div> }));
vi.mock('@/pages/CoachingPage', () => ({ default: () => <div>coaching</div> }));
vi.mock('@/pages/NotFound',     () => ({ default: () => <div>notfound</div> }));
vi.mock('@/pages/UnlinkCallback', () => ({ default: () => <div>unlink</div> }));
vi.mock('@/components/BottomNav', () => ({ default: () => <div data-testid="bottom-nav" /> }));
vi.mock('@/hooks/useAmplitude',   () => ({ useAmplitude: () => {}, identify: () => {}, track: () => {} }));
vi.mock('@/lib/user-stats',       () => ({ initFirstUseDate: () => {}, getDaysSinceFirstUse: () => 0 }));
vi.mock('@/components/tds-adapter', () => ({
  Toaster: () => null,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/components/ui/sonner', () => ({ Toaster: () => null }));

import { RootPage } from '@/App';

describe('RootPage redirect logic', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => { localStorage.clear(); vi.resetAllMocks(); });

  it('redirects to /intro when intro_seen is not set', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/"      element={<RootPage />} />
          <Route path="/intro" element={<div>intro</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('intro')).toBeTruthy();
  });

  it('renders home when intro_seen is set', () => {
    localStorage.setItem('intro_seen', '1');
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/"      element={<RootPage />} />
          <Route path="/intro" element={<div>intro</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByText('intro')).toBeNull();
    expect(screen.getByText('home')).toBeTruthy();
  });
});
