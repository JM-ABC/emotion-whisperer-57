

# Amplitude Taxonomy 설계

현재 앱의 주요 기능(감정 기록, 인사이트, AI 코칭)을 기반으로 유저 속성과 이벤트 택소노미를 설계합니다.

---

## 1. User Properties (유저 속성)

인증이 없는 현재 구조에서는 localStorage 기반으로 수집 가능한 항목만 포함합니다.

| Property | Type | 설명 |
|---|---|---|
| `total_memories` | number | 누적 기억 저장 수 |
| `top_island` | string | 가장 많이 기록된 섬 (joy, sadness 등) |
| `days_since_first_use` | number | 첫 사용 이후 경과일 |
| `last_active_date` | string | 마지막 활동 날짜 (YYYY-MM-DD) |
| `preferred_persona` | string | 가장 자주 선택한 코칭 캐릭터 |

---

## 2. Events (행동 이벤트)

### 핵심 이벤트

| Event Name | Trigger | Properties |
|---|---|---|
| `page_viewed` | 각 페이지 진입 시 | `page_name`: home / write / insight / coaching |
| `diary_started` | 일기 작성 시작 (첫 글자 입력) | `char_count`: 0 |
| `diary_submitted` | "AI에게 맡기기" 버튼 클릭 | `char_count`, `word_count` |
| `emotion_analyzed` | AI 분석 결과 수신 | `emotion`, `island`, `core_memory_length` |
| `emotion_edited` | 감정 수정하기 클릭 | `original_emotion`, `new_emotion` |
| `memory_saved` | 기억 저장 완료 | `emotion`, `island` |
| `mission_viewed` | 미션 화면 표시 | `island` |
| `mission_dismissed` | 미션 닫기 | `island` |

### 인사이트 이벤트

| Event Name | Trigger | Properties |
|---|---|---|
| `insight_tab_changed` | 분포/캘린더 탭 전환 | `tab`: chart / calendar |
| `insight_period_changed` | 기간 필터 변경 | `period`: daily / weekly / monthly |
| `memory_detail_viewed` | 기억 구슬 또는 캘린더 날짜 클릭 | `emotion`, `island` |

### 코칭 이벤트

| Event Name | Trigger | Properties |
|---|---|---|
| `coaching_persona_selected` | 코칭 캐릭터 선택 | `persona`: joy / sadness / anger / fear / disgust |
| `coaching_completed` | 코칭 결과 수신 | `persona`, `has_pattern_data`: boolean |
| `coaching_retried` | "다시 코칭 받기" 클릭 | `persona` |

### 네비게이션 이벤트

| Event Name | Trigger | Properties |
|---|---|---|
| `nav_item_clicked` | 하단 네비게이션 클릭 | `destination`: home / write / insight / coaching |
| `island_clicked` | 홈에서 섬 클릭 | `island`, `memory_count` |
| `orb_clicked` | 기억 구슬 클릭 | `emotion`, `island` |

### 에러 이벤트

| Event Name | Trigger | Properties |
|---|---|---|
| `error_occurred` | AI 분석/코칭 실패 | `error_type`: analyze / coaching, `error_message` |

---

## 3. 구현 방식

- `useAmplitude` 훅에 `track(eventName, properties)` 헬퍼 함수를 추가
- 각 페이지/컴포넌트에서 `track()` 호출
- User Properties는 `memory_saved` 이벤트 시점에 `amplitude.identify()`로 갱신

### 수정 파일

| 파일 | 변경 내용 |
|---|---|
| `src/hooks/useAmplitude.ts` | `track()`, `identify()` 헬퍼 export 추가 |
| `src/pages/Index.tsx` | `page_viewed`, `island_clicked`, `orb_clicked` |
| `src/pages/WritePage.tsx` | `diary_started/submitted`, `emotion_analyzed/edited`, `memory_saved`, `mission_viewed/dismissed` |
| `src/pages/InsightPage.tsx` | `page_viewed`, `insight_tab/period_changed`, `memory_detail_viewed` |
| `src/pages/CoachingPage.tsx` | `page_viewed`, `coaching_persona_selected/completed/retried` |
| `src/components/BottomNav.tsx` | `nav_item_clicked` |
| `src/components/EmotionResultCard.tsx` | `emotion_edited` 트리거 |

