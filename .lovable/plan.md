
# 섬 이미지 박스 제거 + 누끼 효과 강화

## 문제
섬 이미지들의 흰색/밝은 배경이 사각형 박스처럼 보여 어색합니다. `mix-blend-mode: screen`이 이미 적용되어 있지만, 일부 컴포넌트에는 적용되지 않았고, 추가로 border/background 스타일이 박스 느낌을 주고 있습니다.

## 변경 내용

### 1. IslandNode.tsx (홈 화면 섬 지도)
- 이미 `mix-blend-mode: screen`이 적용되어 있으나, `brightness`와 `contrast`를 더 높여 흰 배경이 완전히 사라지도록 보정
- `drop-shadow` 색상을 섬 테마 컬러로 변경하여 자연스러운 발광 효과 추가

### 2. EmotionPicker.tsx (감정 선택 화면)
- 섬 이미지(`w-10 h-10`)에 `mix-blend-mode: screen` 적용 (현재 미적용 상태)
- 섬 선택 버튼의 `border`, `bg-card` 배경을 투명하게 변경하여 박스 느낌 제거
- 선택 상태만 미묘한 하이라이트로 표시

### 3. EmotionResultCard.tsx (분석 결과 화면)
- 섬 아이콘 이미지에 `mix-blend-mode: screen` 적용 (현재 미적용 상태)
- 아이콘을 감싼 원형 배경(`rounded-full`)의 불투명도를 낮춰 더 자연스럽게 처리

## 수정 파일

| 파일 | 변경 |
|------|------|
| `src/components/IslandNode.tsx` | brightness/contrast 강화 |
| `src/components/EmotionPicker.tsx` | 이미지에 mix-blend-mode 추가, 버튼 배경/테두리 투명화 |
| `src/components/EmotionResultCard.tsx` | 이미지에 mix-blend-mode 추가 |
