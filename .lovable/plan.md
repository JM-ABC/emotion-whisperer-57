
# 섬 배치 지그재그 리듬감 + 상호작용 효과 강화

## 1. 지그재그 배치 (Index.tsx)

각 행의 섬들을 `marginLeft`/`marginRight` 인라인 스타일로 5~10px씩 비대칭으로 밀어 자연스러운 "떠 있는 섬" 느낌을 줍니다.

| 섬 | 현재 | 변경 |
|---|---|---|
| Row 1: 기쁨 (중앙) | 정중앙 | `marginLeft: 6px` 살짝 오른쪽 |
| Row 2: 평화 (왼쪽) | 정렬 | `marginTop: -4px` 살짝 위로 |
| Row 2: 사랑 (오른쪽) | 정렬 | `marginTop: 6px` 살짝 아래로 |
| Row 3: 희망 | 정렬 | `marginLeft: 8px` 오른쪽으로 |
| Row 3: 슬픔 | 정렬 | `marginTop: -3px` 살짝 위로 |
| Row 3: 분노 | 정렬 | `marginRight: 5px` 왼쪽으로 |
| Row 4: 불안 | 정렬 | `marginTop: 4px` 살짝 아래로 |
| Row 4: 피로 | 정렬 | `marginTop: -2px` 살짝 위로 |

Grid 구조는 그대로 유지하고, 각 div의 `style`에 미세 오프셋만 추가합니다.

## 2. 상호작용 효과 강화 (IslandNode.tsx)

현재 `whileHover: scale 1.1`, `whileTap: scale 0.95`가 이미지(motion.div)에만 있음. 이를 강화:

- **Hover**: 이미지 scale `1.1` → `1.15`, glow opacity `0.4` → `0.6`으로 더 밝게
- **Tap**: scale `0.95` → `0.9`, 동시에 glow가 순간적으로 `opacity: 0.8`로 번쩍이는 효과
- **Glow 요소**: `group-hover:opacity-40` → `group-hover:opacity-60`, `transition-all duration-300` 추가
- **라벨**: hover 시 `scale(1.05)` 살짝 커지는 효과 추가

## 수정 파일

| 파일 | 변경 내용 |
|---|---|
| `src/pages/Index.tsx` | 각 섬 wrapper div에 미세 margin 오프셋 style 추가 |
| `src/components/IslandNode.tsx` | whileHover/whileTap 강화, glow opacity 증가 |
