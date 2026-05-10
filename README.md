# Core Memory

> 당신의 감정을 기록하고, AI와 함께 성장하는 감정 다이어리 앱

## 소개

Core Memory는 일상의 감정을 8개의 감정 섬에 기록하고, AI 분석을 통해 자신을 이해하고 성장할 수 있도록 돕는 웹 애플리케이션입니다.

- **기쁨의 섬** (Joy) — 행복, 설렘
- **평온의 섬** (Peace) — 평온, 만족
- **사랑의 섬** (Love) — 사랑, 감사
- **희망의 섬** (Hope) — 희망, 영감
- **슬픔의 섬** (Sadness) — 슬픔, 외로움
- **분노의 섬** (Anger) — 분노, 짜증
- **불안의 섬** (Fear) — 불안, 두려움
- **피로의 섬** (Fatigue) — 지침, 무기력

## 주요 기능

| 기능 | 설명 |
|------|------|
| 감정 기록 | 자유롭게 글을 쓰면 AI가 감정을 분석하고 적절한 섬에 저장합니다 |
| 감정 인사이트 | 기록한 감정의 분포와 캘린더를 통해 나의 감정 패턴을 시각적으로 확인합니다 |
| AI 코칭 | 5가지 감정 캐릭터(Joy, Sadness, Anger, Fear, Disgust) 중 선택하여 맞춤형 코칭을 받습니다 |
| 기억 구슬 | 저장된 기억들이 아름다운 구슬 형태로 홈 화면에 표시됩니다 |
| 미션 추천 | 감정 분석 결과에 따라 일상 실천 미션을 추천받습니다 |

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| State | React Query, localStorage |
| Backend | Lovable Cloud (Supabase) |
| AI | Supabase Edge Functions (Gemini 기반 감정 분석 / 코칭) |
| Analytics | Amplitude (행동 데이터 수집) |
| Testing | Vitest, Testing Library |

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트 실행
npm run test
```

## 프로젝트 구조

```
src/
├── components/        # UI 컴포넌트 (shadcn/ui + 커스텀)
├── pages/             # 라우트 페이지 (Home, Write, Insight, Coaching)
├── hooks/             # 커스텀 훅 (Amplitude 트래킹, Toast)
├── lib/               # 유틸리티 (감정 데이터, 메모리 스토어, 사용자 통계)
├── integrations/      # 외부 연동 (Supabase 클라이언트)
└── main.tsx           # 앱 진입점

supabase/functions/    # Edge Functions
├── analyze-emotion/   # AI 감정 분석
├── ai-coaching/       # AI 코칭 응답
└── generate-island-images/  # 섬 이미지 생성
```

## Amplitude Taxonomy

이 프로젝트는 Amplitude를 통해 상세한 사용자 행동 데이터를 수집합니다.

### User Properties
- `total_memories` — 누적 기억 저장 수
- `top_island` — 가장 많이 기록된 섬
- `last_active_date` — 마지막 활동일
- `days_since_first_use` — 첫 사용 이후 경과일
- `streak_days` — 연속 기록 일수
- `preferred_persona` — 가장 자주 선택한 코칭 캐릭터
- `total_coaching_sessions` — 누적 코칭 횟수

### 주요 이벤트
- `page_viewed`, `nav_item_clicked`, `island_clicked`, `orb_clicked`
- `diary_started`, `diary_submitted`, `emotion_analyzed`, `memory_saved`
- `insight_tab_changed`, `memory_detail_viewed`
- `coaching_persona_selected`, `coaching_completed`
- `error_occurred`

자세한 Taxonomy는 [docs/amplitude-taxonomy.md](docs/amplitude-taxonomy.md)를 참고하세요. (선택사항)

## 환경 변수

프로젝트는 Lovable Cloud가 자동으로 환경 변수를 관리합니다. 별도 설정이 필요하지 않습니다.

| 변수 | 설명 |
|------|------|
| `VITE_SUPABASE_URL` | Lovable Cloud 데이터베이스 URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 클라이언트용 anon key |
| `VITE_SUPABASE_PROJECT_ID` | 프로젝트 ID |

## 배포

[Lovable](https://lovable.dev)에서 **Share → Publish**를 클릭하면 배포됩니다.

---

<p align="center">
  Built with ❤️ using <a href="https://lovable.dev">Lovable</a>
</p>
