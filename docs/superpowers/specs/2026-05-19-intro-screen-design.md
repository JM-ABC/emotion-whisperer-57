# 인트로 화면 설계 — 코어 메모리

**날짜:** 2026-05-19
**상태:** 승인됨

## 개요

앱 최초 실행 시 표시되는 단일 스플래시 화면. 앱인토스 CLAUDE.md 규정 준수:
앱 시작 시 `appLogin()` 자동 호출 금지 — 반드시 인트로 화면 → 사용자 액션 → 로그인 순서.

## 결정 사항

| 항목 | 결정 |
|------|------|
| 화면 형식 | 단일 스플래시 (슬라이드 없음) |
| 표시 조건 | 최초 실행에만 (이후 홈으로 바로 진입) |
| CTA 플로우 | "시작하기" 클릭 → 토스 로그인 → 홈 |
| 비주얼 스타일 | 기억 구슬 비주얼형 (부유하는 구슬 + 앱 이름 + tagline) |

## 컴포넌트 설계

### `src/pages/IntroPage.tsx`

레이아웃 (위→아래):
1. 전체 화면 다크 별빛 배경 — 기존 `StarField` 컴포넌트 재사용
2. 중앙 구역: 5개 기억 구슬 float 애니메이션 (framer-motion, 각자 다른 속도/방향)
   - 구슬 색상: 보라(#6d28d9), 노랑(#d97706), 초록(#059669), 빨강(#dc2626), 파랑(#2563eb)
   - 크기: 중앙 구슬 36px, 나머지 12~20px
3. 앱 이름 "코어 메모리" — 22px bold, 색상 #f1f5f9
4. tagline "감정 하나하나가 빛나는 기억이 됩니다" — 11px, 색상 #94a3b8, 줄바꿈 허용
5. "시작하기" 버튼 — 보라 그라디언트(#6d28d9 → #4f46e5), 28px radius, 로딩 중 비활성화

### 첫 실행 감지

```
localStorage.getItem('intro_seen') === null  →  /intro 표시
localStorage.getItem('intro_seen') === '1'  →  / (홈) 직행
```

## 라우팅 변경

### `src/App.tsx`

```
변경 전: "/"  →  <Index />
변경 후:
  - "/intro"  →  <IntroPage />
  - "/"  →  <RootPage /> (신규 인라인 컴포넌트)

// RootPage: intro_seen 없으면 /intro로 리다이렉트, 있으면 홈 렌더링
const RootPage = () => {
  if (!localStorage.getItem('intro_seen')) {
    return <Navigate to="/intro" replace />;
  }
  return <Index />;
};
```

BottomNav 조건부 숨김:
```tsx
// useLocation().pathname !== '/intro' 일 때만 렌더링
const location = useLocation();
{location.pathname !== '/intro' && <BottomNav />}
```

## 로그인 플로우

```
시작하기 클릭
  → setLoading(true)
  → useAppLogin().login()
    ├─ 성공: localStorage.setItem('intro_seen', '1') → navigate('/', { replace: true })
    └─ 실패: toast 에러 표시, 인트로 유지 (재시도 가능)
```

## 애니메이션

- 화면 진입: `opacity 0→1`, `y 20→0`, duration 0.6s (framer-motion)
- 구슬 float: 각 구슬에 개별 `y: [0, -8, 0]` 루프, duration 2.5~4s, easing "easeInOut"
- 버튼: `whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.97 }}`

## 에러 처리

- 로그인 실패: `useToast`로 에러 메시지 표시, 버튼 다시 활성화
- 앱 환경 외(브라우저 테스트): "앱 환경에서 실행해주세요" toast 표시 — `useAppLogin` 기존 동작 그대로

## 제약 조건 (CLAUDE.md)

- `appLogin()` 은 반드시 사용자 클릭("시작하기") 이후에만 호출 — 자동 호출 금지
- 인트로 화면에 커스텀 `<header>` 또는 앱바 없음 — granite.config.ts 네이티브 네비게이션바만 사용
- `alert()`, `confirm()`, `prompt()` 사용 금지 — toast/dialog 사용

## 파일 변경 목록

| 파일 | 변경 유형 |
|------|----------|
| `src/pages/IntroPage.tsx` | 신규 생성 |
| `src/App.tsx` | 라우트 추가, BottomNav 조건부 렌더링, 리다이렉트 로직 추가 |
