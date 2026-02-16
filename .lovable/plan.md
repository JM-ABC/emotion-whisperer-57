
# 3대 기능 보완: 컬러 테마 + 캐릭터 코칭 + 미션/히트맵

## 개요
요청하신 3가지 영역을 모두 구현합니다:
1. **감정별 컬러 테마** - 감정 선택/확인 시 전체 배경이 해당 감정 색으로 물드는 몰입 경험
2. **캐릭터 기반 AI 코칭** - 기쁨이/슬픔이 등 페르소나 모드 선택 + 패턴 분석 리포트
3. **감정 해소 미션 + 캘린더 히트맵** - 감정별 맞춤 미션 제안 + 기록 시각화

---

## 1. 감정별 컬러 테마 (시각적 몰입)

### 변경 사항
- **WritePage.tsx**: AI 분석 결과 확인 단계(`confirm`)에서 배경에 감정 색상의 그라데이션 오버레이 추가
- **EmotionResultCard.tsx**: 카드 배경과 주변에 감정 색상 glow가 더 강하게 퍼지도록 개선
- **OrbSaveAnimation.tsx**: 저장 애니메이션 중 전체 화면이 해당 감정 색으로 은은하게 물드는 효과
- **Index.tsx**: 오늘의 기억이 있을 경우, 헤더 영역에 해당 감정의 은은한 컬러 악센트 적용

### 구현 방식
- `framer-motion`의 `animate`로 배경 `radial-gradient` 오버레이를 부드럽게 전환
- 각 Island의 색상 매핑은 기존 `ISLAND_COLORS` 재활용
- 과하지 않게 opacity 20~30% 수준의 은은한 배경 변화

---

## 2. 캐릭터 기반 AI 코칭 (Premium 페이지 실제 구현)

### 새로운 페이지/컴포넌트
| 파일 | 작업 |
|------|------|
| `src/pages/CoachingPage.tsx` | **전면 수정** - 실제 AI 코칭 기능 구현 |
| `src/components/CoachingPersonaSelector.tsx` | **신규** - 기쁨이/슬픔이/버럭이 등 페르소나 선택 UI |
| `src/components/PatternReport.tsx` | **신규** - "이번 주 소심이가 40%였네요" 같은 패턴 분석 카드 |
| `supabase/functions/ai-coaching/index.ts` | **신규** - 페르소나별 AI 코칭 메시지 생성 Edge Function |

### 코칭 페르소나 (5종)
| 페르소나 | 말투 스타일 | 적합한 상황 |
|---------|-----------|-----------|
| 기쁨이 (Joy) | 밝고 에너지 넘치는 격려 | 동기부여, 축하 |
| 슬픔이 (Sadness) | 조용하고 깊은 공감 | 위로, 경청 |
| 버럭이 (Anger) | 직설적이고 솔직한 조언 | 행동 촉구, 현실 직시 |
| 소심이 (Fear) | 조심스럽고 신중한 분석 | 리스크 점검, 대비 |
| 까칠이 (Disgust) | 냉철하고 날카로운 피드백 | 객관적 판단, 기준 제시 |

### AI 코칭 Edge Function 설계
- 입력: 최근 7일간의 기억 데이터 + 선택한 페르소나
- 출력: 페르소나 톤의 코칭 메시지 + 패턴 분석 요약 + 액션 팁
- 시스템 프롬프트에 페르소나별 말투/성격 지시

### 패턴 분석 리포트
- 기존 `getInsights()` 함수 활용
- 가장 많은 섬, 가장 적은 섬, 주간 변화 트렌드를 계산
- AI가 이 데이터를 기반으로 "이번 주 OO이가 XX%였네요" 형태의 인사이트 생성

---

## 3. 감정 해소 미션 + 캘린더 히트맵

### 새로운 컴포넌트
| 파일 | 작업 |
|------|------|
| `src/components/EmotionMission.tsx` | **신규** - 감정별 맞춤 미션 카드 (저장 직후 표시) |
| `src/components/EmotionCalendar.tsx` | **신규** - 캘린더 히트맵 (감정 기록 시각화) |
| `src/pages/InsightPage.tsx` | **수정** - 히트맵 탭 추가 |

### 감정별 미션 예시
| 감정 섬 | 미션 예시 |
|--------|----------|
| 분노 | "3분 심호흡 챌린지", "종이에 감정 쏟아내기" |
| 슬픔 | "좋아하는 음악 한 곡 듣기", "따뜻한 음료 마시기" |
| 기쁨 | "이 순간 사진으로 남기기", "감사한 것 3개 적기" |
| 피로 | "10분 스트레칭", "일찍 잠자리에 들기" |
| 불안 | "지금 확실한 것 3가지 떠올리기", "5분 명상" |
| 평온 | "산책하며 이 기분 유지하기" |
| 사랑 | "소중한 사람에게 메시지 보내기" |
| 희망 | "내일 할 작은 목표 하나 세우기" |

### 미션 표시 타이밍
- 기억 저장 완료 후 (OrbSaveAnimation 이후), 홈으로 돌아가기 전 미션 카드 표시
- "오늘의 작은 미션" 형태로 1개 랜덤 추천

### 캘린더 히트맵
- 월간 달력 형태, 각 날짜 셀에 해당일의 감정 색상 dot 표시
- 기록 없는 날은 빈 셀, 기록 있는 날은 감정 섬 색상의 원형 표시
- 날짜 클릭 시 해당 날의 기억 내용 표시
- InsightPage에 "캘린더" 탭으로 추가 (기존 바 차트와 병렬)

---

## 변경 파일 요약

| 파일 | 작업 | 내용 |
|------|------|------|
| `src/pages/WritePage.tsx` | 수정 | 감정 컬러 배경 오버레이 + 미션 단계 추가 |
| `src/pages/CoachingPage.tsx` | 전면 수정 | 페르소나 선택 + AI 코칭 실제 구현 |
| `src/pages/InsightPage.tsx` | 수정 | 캘린더 히트맵 탭 추가 |
| `src/pages/Index.tsx` | 수정 | 오늘 감정 컬러 악센트 |
| `src/components/EmotionResultCard.tsx` | 수정 | 컬러 테마 강화 |
| `src/components/CoachingPersonaSelector.tsx` | 신규 | 5종 페르소나 선택 UI |
| `src/components/PatternReport.tsx` | 신규 | 주간 패턴 분석 카드 |
| `src/components/EmotionMission.tsx` | 신규 | 감정별 맞춤 미션 |
| `src/components/EmotionCalendar.tsx` | 신규 | 캘린더 히트맵 |
| `src/lib/missions.ts` | 신규 | 감정별 미션 데이터 |
| `supabase/functions/ai-coaching/index.ts` | 신규 | 페르소나별 AI 코칭 Edge Function |

---

## 기술 세부사항

### 컬러 테마 오버레이 구현
- `position: fixed` 풀스크린 div에 `radial-gradient` 적용
- `framer-motion`으로 opacity 0 -> 0.25 애니메이션
- `pointer-events: none`로 상호작용 방해 없음
- phase 변경 시 색상 전환

### AI 코칭 Edge Function
- 시스템 프롬프트에 선택된 페르소나의 성격/말투 정의
- 최근 기억 데이터를 함께 전달하여 맥락 있는 코칭 생성
- Tool calling으로 구조화된 응답 (coaching_message, pattern_insight, action_tip)
- 스트리밍 방식으로 코칭 메시지를 실시간 표시

### 캘린더 히트맵
- 순수 CSS Grid 기반 (외부 라이브러리 없음)
- `date-fns` 활용하여 월간 날짜 계산
- 각 셀에 MemoryOrb 미니 버전 표시 (크기 16px)
