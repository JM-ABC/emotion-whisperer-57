# 인트로 화면 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 앱 최초 실행 시 기억 구슬 비주얼 스플래시 화면을 표시하고, "시작하기" 클릭 → 토스 로그인 → 홈 진입 플로우를 구현한다.

**Architecture:** `IntroPage` 컴포넌트(신규)가 별빛 배경 위에 부유하는 구슬 애니메이션과 CTA 버튼을 렌더링한다. `App.tsx`에 `AppLayout` 컴포넌트를 추출하여 `useLocation`으로 `/intro` 경로에서 BottomNav를 숨기고, `RootPage`가 `intro_seen` localStorage 키를 확인해 최초 진입 시 `/intro`로 리다이렉트한다.

**Tech Stack:** React 18, TypeScript, framer-motion, react-router-dom v6, @testing-library/react, Vitest

---

## 파일 구조

| 파일 | 변경 |
|------|------|
| `src/pages/IntroPage.tsx` | 신규 생성 |
| `src/App.tsx` | AppLayout 추출, RootPage 추가, /intro 라우트, BottomNav 조건부 |
| `src/test/intro.test.tsx` | 신규 생성 (TDD) |

---

### Task 1: IntroPage 컴포넌트

**Files:**
- Create: `src/pages/IntroPage.tsx`
- Create: `src/test/intro.test.tsx`

- [ ] **Step 1: 테스트 파일 작성 (failing)**

`src/test/intro.test.tsx` 를 아래 내용으로 생성:

```tsx
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
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

```bash
npx vitest run src/test/intro.test.tsx
```

예상 출력: `FAIL` — `Cannot find module '@/pages/IntroPage'`

- [ ] **Step 3: IntroPage 구현**

`src/pages/IntroPage.tsx` 를 아래 내용으로 생성:

```tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
import { useAppLogin } from '@/hooks/useAppLogin';

const ORBS = [
  { color: '#6d28d9', size: 36, x: 0,   y: 0,   delay: 0.0, duration: 3.2 },
  { color: '#d97706', size: 18, x: -52, y: -24, delay: 0.4, duration: 2.6 },
  { color: '#059669', size: 22, x: 44,  y: -20, delay: 0.8, duration: 3.8 },
  { color: '#dc2626', size: 14, x: -36, y: 28,  delay: 1.2, duration: 2.9 },
  { color: '#2563eb', size: 16, x: 48,  y: 30,  delay: 1.6, duration: 3.5 },
] as const;

export default function IntroPage() {
  const navigate = useNavigate();
  const { login, loading } = useAppLogin();

  async function handleStart() {
    const result = await login();
    if (result) {
      localStorage.setItem('intro_seen', '1');
      navigate('/', { replace: true });
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      <StarField />

      {/* Floating memory orbs */}
      <div className="relative z-10 w-44 h-44 flex items-center justify-center mb-6">
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle at 35% 35%, ${orb.color}cc, ${orb.color})`,
              boxShadow: `0 0 ${Math.round(orb.size * 0.6)}px ${orb.color}99`,
              left: `calc(50% + ${orb.x}px - ${orb.size / 2}px)`,
              top:  `calc(50% + ${orb.y}px - ${orb.size / 2}px)`,
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: orb.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-3 px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          코어 메모리
        </h1>
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          감정 하나하나가<br />빛나는 기억이 됩니다
        </p>

        <motion.button
          onClick={handleStart}
          disabled={loading}
          className="mt-6 bg-gradient-to-r from-violet-700 to-indigo-600 text-white font-bold rounded-full px-10 py-3 text-sm disabled:opacity-50"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? '로그인 중...' : '시작하기'}
        </motion.button>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx vitest run src/test/intro.test.tsx
```

예상 출력: `PASS` — 3개 테스트 모두 통과

- [ ] **Step 5: 커밋**

```bash
git add src/pages/IntroPage.tsx src/test/intro.test.tsx
git commit -m "feat: add IntroPage with memory orb visual and login CTA"
```

---

### Task 2: App.tsx 라우팅 변경

`useLocation`은 `<BrowserRouter>` 내부에서만 호출 가능하므로, 현재 `App.tsx`의 라우터 내부 UI를 `AppLayout` 컴포넌트로 분리한다.
라우팅 테스트는 `App.tsx`의 cascading import를 피하기 위해 별도 파일로 분리한다.

**Files:**
- Modify: `src/App.tsx`
- Create: `src/test/routing.test.tsx`

- [ ] **Step 1: 라우팅 테스트 파일 작성 (failing)**

`src/test/routing.test.tsx` 를 아래 내용으로 생성:

```tsx
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
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

```bash
npx vitest run src/test/routing.test.tsx
```

예상 출력: `FAIL` — `RootPage` not exported from `@/App`

- [ ] **Step 3: App.tsx 수정**

`src/App.tsx` 전체를 아래로 교체:

```tsx
import { useEffect } from "react";
import { Toaster } from "@/components/tds-adapter";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/tds-adapter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import IntroPage from "./pages/IntroPage";
import WritePage from "./pages/WritePage";
import InsightPage from "./pages/InsightPage";
import CoachingPage from "./pages/CoachingPage";
import NotFound from "./pages/NotFound";
import UnlinkCallback from "./pages/UnlinkCallback";
import BottomNav from "./components/BottomNav";
import { useAmplitude, identify } from "./hooks/useAmplitude";
import { initFirstUseDate, getDaysSinceFirstUse } from "./lib/user-stats";

const queryClient = new QueryClient();

export const RootPage = () => {
  if (!localStorage.getItem('intro_seen')) {
    return <Navigate to="/intro" replace />;
  }
  return <Index />;
};

const AppLayout = () => {
  const location = useLocation();
  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <Routes>
        <Route path="/"        element={<RootPage />} />
        <Route path="/intro"   element={<IntroPage />} />
        <Route path="/write"   element={<WritePage />} />
        <Route path="/insight" element={<InsightPage />} />
        <Route path="/coaching" element={<CoachingPage />} />
        <Route path="/unlink"  element={<UnlinkCallback />} />
        <Route path="*"        element={<NotFound />} />
      </Routes>
      {location.pathname !== '/intro' && <BottomNav />}
    </div>
  );
};

const App = () => {
  useAmplitude();

  useEffect(() => {
    initFirstUseDate();
    identify({ days_since_first_use: getDaysSinceFirstUse() });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
```

- [ ] **Step 4: 라우팅 테스트 통과 확인**

```bash
npx vitest run src/test/routing.test.tsx
```

예상 출력: `PASS` — 2개 테스트 모두 통과

- [ ] **Step 5: 전체 빌드 확인**

```bash
npm run build
```

예상 출력: 에러 없이 `dist/` 생성

- [ ] **Step 6: 커밋**

```bash
git add src/App.tsx src/test/routing.test.tsx
git commit -m "feat: routing — add /intro route, RootPage redirect, hide BottomNav on intro"
```

---

## 완료 기준

- [ ] `npx vitest run src/test/intro.test.tsx` → 5개 테스트 PASS
- [ ] `npm run build` → 에러 없음
- [ ] `localStorage` 에 `intro_seen` 없을 때 → `/intro` 화면 표시
- [ ] "시작하기" 클릭 → 로그인 → 홈 이동, `intro_seen = '1'` 저장
- [ ] `/write`, `/insight`, `/coaching` 에서 BottomNav 보임
- [ ] `/intro` 에서 BottomNav 숨김
