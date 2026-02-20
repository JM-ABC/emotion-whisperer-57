
# 섬 이미지 AI 생성으로 교체

## 개요
현재 8개 섬 이미지를 Lovable AI 이미지 생성(google/gemini-2.5-flash-image)을 사용하여 투명 배경의 고품질 아이콘으로 교체합니다. 이렇게 하면 `mix-blend-mode` 해킹 없이도 자연스럽게 표시됩니다.

## AI 이미지 생성 계획

Edge Function을 만들어 8개 섬 이미지를 생성하고 Storage에 저장합니다.

### 생성할 이미지 8개

| 섬 | 프롬프트 키워드 | 컨셉 |
|-----|----------------|-------|
| joy (기쁨) | Sunny golden floating island, warm light rays | 빛나는 황금빛 섬 |
| peace (평온) | Calm blue ocean floating island, gentle waves | 고요한 파란 물결 섬 |
| love (사랑) | Pink heart-shaped floating island, warm glow | 분홍빛 하트 모양 섬 |
| hope (희망) | Green sprouting floating island, fresh leaves | 초록 새싹이 자라는 섬 |
| sadness (슬픔) | Rainy blue floating island, rain clouds | 비 내리는 파란 섬 |
| anger (분노) | Red volcanic floating island, lava, fire | 붉은 화산 섬 |
| fear (불안) | Purple misty floating island, fog, swirls | 보라색 안개 섬 |
| fatigue (피로) | Dark blue moonlit floating island, crescent moon | 달빛 어두운 섬 |

## 구현 방식

### 1. Edge Function 생성: `generate-island-images`
- Lovable AI (`google/gemini-2.5-flash-image`)를 호출하여 8개 섬 이미지 생성
- 각 이미지를 "isolated on transparent background, flat illustration style, no background" 키워드로 생성
- 생성된 base64 이미지를 Storage 버킷에 업로드
- 한번 호출하면 8개 모두 생성

### 2. Storage 버킷 생성
- `island-images` 버킷 생성 (public)
- `joy.png`, `peace.png` 등 8개 파일 저장

### 3. 프론트엔드 수정
- `src/lib/island-images.ts`: Storage URL에서 이미지를 불러오도록 변경
- `src/components/IslandNode.tsx`: `mix-blend-mode: screen` 제거 (투명 배경이므로 불필요)
- `src/components/EmotionPicker.tsx`: 블렌딩 스타일 제거
- `src/components/EmotionResultCard.tsx`: 블렌딩 스타일 제거

## 변경 파일 요약

| 파일 | 작업 |
|------|------|
| `supabase/functions/generate-island-images/index.ts` | 신규 - AI 이미지 생성 Edge Function |
| DB migration | Storage 버킷 생성 + 정책 |
| `src/lib/island-images.ts` | 수정 - Storage URL로 변경 |
| `src/components/IslandNode.tsx` | 수정 - 블렌딩 스타일 제거 |
| `src/components/EmotionPicker.tsx` | 수정 - 블렌딩 스타일 제거 |
| `src/components/EmotionResultCard.tsx` | 수정 - 블렌딩 스타일 제거 |

## 기술 세부사항

### AI 이미지 생성 프롬프트 (각 섬 공통 형식)
```text
A cute floating fantasy island, [섬별 키워드], Pixar-style 3D illustration, 
isolated on pure black background, no frame, no border, 
soft ambient glow, game icon style, centered composition
```

검은 배경에 생성하면 앱의 어두운 테마와 자연스럽게 어울리며, 필요시 `mix-blend-mode: screen`으로 완전히 투명하게 만들 수 있습니다.

### Edge Function 호출 흐름
1. 관리자가 Edge Function을 한번 호출
2. 8개 섬에 대해 순차적으로 AI 이미지 생성
3. 각 이미지를 Storage에 업로드
4. 프론트엔드는 Storage public URL에서 이미지를 불러옴
