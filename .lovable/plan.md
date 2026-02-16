
# 캐릭터 이미지 적용 + 섬 이미지 준비

## 개요
업로드해주신 5개 캐릭터 이미지를 코칭 페르소나 선택 UI에 적용합니다. 개별 섬 이미지는 올려주시면 바로 적용할 예정입니다.

## 캐릭터-이미지 매핑

| 캐릭터 | 이미지 | 설명 |
|--------|--------|------|
| 기쁨이 (Joy) | 노란 빛나는 캐릭터 | `Gemini_Generated_Image_60ssv160ssv160ss.png` |
| 슬픔이 (Sadness) | 파란 물방울 캐릭터 | `Gemini_Generated_Image_60ssv160ssv160ss_1.png` |
| 버럭이 (Anger) | 빨간 용암 캐릭터 | `Gemini_Generated_Image_60ssv160ssv160ss_2.png` |
| 소심이 (Fear) | 보라 캐릭터 | `Gemini_Generated_Image_60ssv160ssv160ss_3.png` |
| 까칠이 (Disgust) | 초록 캐릭터 | `Gemini_Generated_Image_60ssv160ssv160ss_4.png` |

## 변경 내용

### 1. 이미지 파일 복사
- 5개 캐릭터 이미지를 `src/assets/characters/` 폴더에 복사
- 파일명을 `joy.png`, `sadness.png`, `anger.png`, `fear.png`, `disgust.png`으로 정리

### 2. CoachingPersonaSelector.tsx 수정
- 이모지(`😊`, `😢` 등) 대신 캐릭터 이미지를 `<img>` 태그로 표시
- 이미지 크기: 약 48x48px (현재 이모지 크기 대비 더 크고 선명하게)
- 선택 시 이미지에 glow 효과 추가
- 그리드를 5열에서 유지하되, 각 셀 높이를 늘려 이미지가 잘 보이도록 조정

### 3. CoachingPage.tsx 수정
- 로딩 상태에서 선택된 캐릭터 이미지를 함께 표시 ("기쁨이가 생각하고 있어요..." 옆에 캐릭터 이미지)
- 코칭 결과 카드 상단에 해당 캐릭터 이미지 작게 표시

### 4. 섬 이미지 (대기)
- 개별 섬 이미지를 올려주시면 `src/assets/islands/` 폴더에 저장
- `IslandNode.tsx`에서 이모지 대신 섬 이미지 사용
- `EmotionPicker.tsx`, `EmotionResultCard.tsx` 등에서도 섬 이모지를 이미지로 교체

---

## 변경 파일 요약

| 파일 | 작업 |
|------|------|
| `src/assets/characters/joy.png` | 복사 - 기쁨이 이미지 |
| `src/assets/characters/sadness.png` | 복사 - 슬픔이 이미지 |
| `src/assets/characters/anger.png` | 복사 - 버럭이 이미지 |
| `src/assets/characters/fear.png` | 복사 - 소심이 이미지 |
| `src/assets/characters/disgust.png` | 복사 - 까칠이 이미지 |
| `src/components/CoachingPersonaSelector.tsx` | 수정 - 이모지를 캐릭터 이미지로 교체 |
| `src/pages/CoachingPage.tsx` | 수정 - 로딩/결과 화면에 캐릭터 이미지 추가 |
