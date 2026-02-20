

# 섬 배치 중앙 균형 + 텍스트 가시성 개선

## 문제 분석
1. 섬 컨테이너(`mx-4`)가 화면 양쪽에 16px 마진만 주고 있어, `%` 기반 좌표가 화면 정중앙과 미세하게 어긋남
2. 라벨이 `-bottom-7`(28px)로 이미지와 너무 가까워 겹침 발생
3. 섬 이름 텍스트와 "나의 기억 구슬" 텍스트가 `text-muted-foreground`로 어두운 배경에서 잘 안 보임

## 변경 사항

### 1. IslandNode.tsx - 배치 완전 대칭화
- 컨테이너를 `mx-4` 대신 `mx-auto`로 변경하여 정확히 가운데 정렬
- `ISLAND_POSITIONS`를 좌우 완전 대칭으로 재조정:

```text
         50%, 6%           (1개 - 상단 중앙)
    35%, 22%  65%, 22%     (2개 - 좌우 대칭)
  25%, 40%  50%, 38%  75%, 40%  (3개 - 중앙 + 좌우 대칭)
      38%, 58%  62%, 58%   (2개 - 좌우 대칭)
```

### 2. IslandNode.tsx - 라벨 위치 조정
- 라벨을 `-bottom-7`에서 `-bottom-9`로 더 아래로 내려 이미지와 겹치지 않도록 함

### 3. 텍스트 가시성 향상
- **섬 이름 텍스트**: `text-muted-foreground` → `text-foreground/70`으로 변경하고 `text-shadow` 추가
- **"나의 기억 구슬" 텍스트** (Index.tsx): `text-xs text-muted-foreground` → `text-sm text-foreground/70 font-medium`으로 변경
- **기억 카운트 텍스트** (Index.tsx): 동일하게 가시성 향상

### 4. Index.tsx - 컨테이너 중앙 정렬
- Islands Map 컨테이너를 `mx-4`에서 `mx-auto max-w-md px-4`로 변경하여 넓은 화면에서도 정중앙 유지

## 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/components/IslandNode.tsx` | 좌표 대칭 재조정, 라벨 위치 아래로, 텍스트 색상 밝게 + 그림자 |
| `src/pages/Index.tsx` | 컨테이너 중앙 정렬, "나의 기억 구슬" 등 텍스트 가시성 향상 |

