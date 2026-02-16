
# AI 기반 자동 감정 분석 플로우 구현

## 개요
현재의 "감정 수동 선택 → 기억 작성" 플로우를 **"자유롭게 하루 일기 작성 → AI가 감정/핵심기억 자동 추출 → 구슬 저장"** 플로우로 전환합니다.

## 새로운 사용자 플로우

```text
[1단계] 자유 작성
  사용자가 오늘 있었던 일을 편하게 적음
  "오늘 회사에서 발표했는데 잘 돼서 기분 좋았어. 근데 퇴근길에 비가 와서 좀 우울했어..."

        ↓ "AI에게 맡기기" 버튼 클릭

[2단계] AI 분석 중 (로딩)
  구슬이 빙글빙글 도는 분석 애니메이션 표시 (1~2초)

        ↓ AI 응답 수신

[3단계] AI 결과 확인
  AI가 추출한 결과를 카드로 표시:
  - 감정 섬: 기쁨의 섬 ☀️
  - 감정: 행복 😊
  - 핵심 기억: "회사 발표가 잘 되어 뿌듯했던 순간"

  사용자가 확인하거나, 감정을 수정할 수 있음

        ↓ "이대로 저장" 또는 감정 수정 후 저장

[4단계] 구슬 저장 애니메이션
  기존 OrbSaveAnimation 재활용 → 홈으로 이동
```

## 변경 파일

| 파일 | 작업 |
|------|------|
| `supabase/functions/analyze-emotion/index.ts` | **신규** - Lovable AI를 사용해 일기 텍스트에서 감정/핵심기억 추출하는 Edge Function |
| `src/pages/WritePage.tsx` | **수정** - 3단계 플로우로 전환 (작성 → AI 분석 → 확인/저장) |
| `src/components/EmotionPicker.tsx` | 유지 - AI 결과 수정 시 수동 선택 폴백으로 재활용 |
| `src/components/AnalyzingAnimation.tsx` | **신규** - AI 분석 중 로딩 애니메이션 (구슬이 빙글빙글 도는 모션) |
| `src/components/EmotionResultCard.tsx` | **신규** - AI가 찾아낸 감정/핵심기억을 보여주는 카드 컴포넌트 |

## 기술 구현 세부사항

### Edge Function: `analyze-emotion`
- Lovable AI Gateway (`google/gemini-3-flash-preview`) 사용
- Tool calling으로 구조화된 응답 추출:
  - `emotion`: 16개 감정 중 하나
  - `island`: 8개 섬 중 하나
  - `core_memory`: 핵심 기억 한 줄 요약
  - `empathy_message`: 공감 한마디
- 비스트리밍 방식 (짧은 응답이므로)
- 429/402 에러 핸들링 포함

### WritePage 3단계 상태 관리
```text
phase: 'write' → 'analyzing' → 'confirm' → 'saved'

write: 자유 텍스트 입력 + "AI에게 맡기기" 버튼
analyzing: AnalyzingAnimation 표시 (1~2초)
confirm: EmotionResultCard 표시 + 수정/저장 버튼
saved: 기존 OrbSaveAnimation
```

### AnalyzingAnimation 컴포넌트
- 구슬이 여러 감정 색상으로 변하면서 회전하는 framer-motion 애니메이션
- "감정을 분석하고 있어요..." 텍스트 표시

### EmotionResultCard 컴포넌트
- AI가 찾은 감정 섬의 색상으로 스타일링된 카드
- 감정 이모지 + 라벨 + 핵심 기억 요약 표시
- AI의 공감 메시지 표시
- "이대로 저장" 버튼 + "감정 수정하기" 토글 (EmotionPicker 폴백)

### Lovable Cloud 필요
- 이 기능은 Lovable AI Edge Function이 필요하므로 Lovable Cloud 활성화가 선행되어야 합니다
- `LOVABLE_API_KEY`는 자동 제공됩니다
