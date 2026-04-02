# Notion Sync Manifest

## 목적
- 로컬 기능정의서와 Notion 기능정의서의 동기화 기준을 관리한다.
- Claude 또는 Codex는 사용자의 명시적 요청이 있을 때만 Notion을 수정한다.

## 동기화 원칙
- 단일 기준 문서
  - `docs/FEATURE_SPEC.md`
- Notion 반영 시점
  - 사용자가 `노션 업데이트`, `노션 반영`, `Notion sync`를 명시적으로 요청한 경우
- 동기화 단위
  - 기능 단위 row 또는 page 단위
- 충돌 처리
  - 로컬 문서 우선
  - Notion만 수정된 내용이 있으면 사용자가 채택 여부를 결정한다.

## 동기화 대상 필드
- `번호`
- `대메뉴`
- `기능명`
- `Depth1`
- `Depth2`
- `Depth3`
- `기능 정의`
- `정책`
- `MASTER`
- `OPERATOR`
- `일반`
- `비고`

## 동기화 절차
1. `docs/FEATURE_SPEC.md` 수정
2. 변경 항목의 `ID`와 `Notion` URL 확인
3. 변경 diff 검토
4. 사용자 승인
5. Notion 업데이트 실행
6. 결과를 `CHANGELOG`에 기록

## 동기화 요청 템플릿
```md
노션 업데이트 요청

- 기준 문서: docs/FEATURE_SPEC.md
- 대상 ID:
  - FS-xxx
- 반영 범위:
  - 기능 정의 / 정책 / 번호 / 권한 / 비고
- 실행 방식:
  - 기존 Notion row 업데이트
```

## 주의사항
- 사용자가 요청하지 않으면 Notion 자동 수정 금지
- 로컬 문서 수정 없이 Notion만 먼저 수정 금지
- 순서 재정렬은 전체 행 검증 후 실행
