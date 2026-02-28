

# Amplitude Taxonomy — Core Memory App

현재 코드에 구현된 트래킹 기준으로 정리한 최종 택소노미입니다.

---

## 1. User Properties

| Property | Type | 갱신 시점 | 설명 |
|---|---|---|---|
| `total_memories` | int | `memory_saved` | 누적 기억 저장 수 |
| `top_island` | string | `memory_saved` | 가장 많이 기록된 섬 ID (joy, sadness 등) |
| `last_active_date` | string | `memory_saved` | 마지막 활동일 (YYYY-MM-DD) |

**추가 제안 (미구현)**

| Property | Type | 갱신 시점 | 설명 |
|---|---|---|---|
| `days_since_first_use` | int | 모든 세션 시작 | 첫 사용 이후 경과일 |
| `preferred_persona` | string | `coaching_completed` | 가장 자주 선택한 코칭 캐릭터 |
| `total_coaching_sessions` | int | `coaching_completed` | 누적 코칭 횟수 |
| `streak_days` | int | `memory_saved` | 연속 기록 일수 |

---

## 2. Events

### 2-A. 페이지 & 네비게이션

| Event | Trigger | Properties |
|---|---|---|
| `page_viewed` | 각 페이지 진입 | `page_name` |
| `nav_item_clicked` | 하단 네비 클릭 | `destination` |
| `island_clicked` | 홈에서 섬 클릭 | `island`, `memory_count` |
| `orb_clicked` | 기억 구슬 클릭 | `emotion`, `island` |

### 2-B. 일기 작성 플로우

| Event | Trigger | Properties |
|---|---|---|
| `diary_started` | 첫 글자 입력 | `char_count` |
| `diary_submitted` | "AI에게 맡기기" 클릭 | `char_count`, `word_count` |
| `emotion_analyzed` | AI 분석 결과 수신 | `emotion`, `island`, `core_memory_length` |
| `emotion_edited` | "감정 수정하기" 클릭 | `original_emotion`, `new_emotion` |
| `memory_saved` | 기억 저장 완료 | `emotion`, `island` |
| `mission_viewed` | 미션 화면 표시 | `island` |
| `mission_dismissed` | "홈으로 돌아가기" 클릭 | `island` |

### 2-C. 인사이트

| Event | Trigger | Properties |
|---|---|---|
| `insight_tab_changed` | 분포/캘린더 탭 전환 | `tab` |
| `insight_period_changed` | 기간 필터 변경 | `period` |
| `memory_detail_viewed` | 캘린더 날짜 클릭 | `emotion`, `island` |

### 2-D. AI 코칭

| Event | Trigger | Properties |
|---|---|---|
| `coaching_persona_selected` | 캐릭터 선택 | `persona` |
| `coaching_completed` | 코칭 결과 수신 | `persona`, `has_pattern_data` |
| `coaching_retried` | "다시 코칭 받기" 클릭 | `persona` |

### 2-E. 에러

| Event | Trigger | Properties |
|---|---|---|
| `error_occurred` | AI 분석/코칭 실패 | `error_type`, `error_message` |

---

## 3. Event Properties 사전

| Property | Type | 사용 이벤트 | 값 예시 |
|---|---|---|---|
| `page_name` | string | `page_viewed` | `home`, `write`, `insight`, `coaching` |
| `destination` | string | `nav_item_clicked` | `home`, `write`, `insight`, `coaching` |
| `island` | string | 다수 | `joy`, `peace`, `love`, `hope`, `sadness`, `anger`, `fear`, `fatigue` |
| `emotion` | string | 다수 | `happy`, `grateful`, `calm`, `hopeful`, `sad`, `angry`, `anxious`, `tired` 등 |
| `memory_count` | int | `island_clicked` | `0` ~ `N` |
| `char_count` | int | `diary_started`, `diary_submitted` | `0` ~ `1000` |
| `word_count` | int | `diary_submitted` | `1` ~ `N` |
| `core_memory_length` | int | `emotion_analyzed` | AI가 생성한 핵심 기억 문자열 길이 |
| `original_emotion` | string | `emotion_edited` | 수정 전 감정 ID |
| `new_emotion` | string | `emotion_edited` | 수정 후 감정 ID |
| `tab` | string | `insight_tab_changed` | `chart`, `calendar` |
| `period` | string | `insight_period_changed` | `daily`, `weekly`, `monthly` |
| `persona` | string | 코칭 이벤트 | `joy`, `sadness`, `anger`, `fear`, `disgust` |
| `has_pattern_data` | boolean | `coaching_completed` | `true`, `false` |
| `error_type` | string | `error_occurred` | `analyze`, `coaching` |
| `error_message` | string | `error_occurred` | 에러 메시지 원문 |

---

## 4. 구현 계획

현재 코드에 이미 구현된 항목: 위 2장의 모든 이벤트 + 3개 User Property.

추가 구현이 필요한 항목:

| 작업 | 파일 | 내용 |
|---|---|---|
| `days_since_first_use` 추가 | `useAmplitude.ts`, `App.tsx` | 첫 사용일을 localStorage에 기록, 세션 시작 시 identify |
| `preferred_persona` 추가 | `CoachingPage.tsx` | coaching_completed 시 localStorage에 persona 카운트 저장 후 identify |
| `total_coaching_sessions` 추가 | `CoachingPage.tsx` | coaching_completed 시 카운트 증가 후 identify |
| `streak_days` 추가 | `WritePage.tsx` | memory_saved 시 연속 기록일 계산 후 identify |
| `page_viewed` 누락 보완 | `InsightPage.tsx` | useEffect에 page_viewed 트래킹 추가 (현재 누락) |

