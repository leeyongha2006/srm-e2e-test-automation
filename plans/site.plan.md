# 테스트 계획: 포트폴리오 사이트

| # | 시나리오 | 기대 결과 | spec |
|---|---|---|---|
| 1 | 첫 화면 열기 | 제목에 Salesforce Developer, 핵심 역량 카드 4개 | home.spec.ts › shows the headline |
| 2 | 위쪽 메뉴 클릭 | 해당 섹션으로 이동, 화면에 보임 | navigation jumps to each section |
| 3 | 프로젝트 분류 버튼 | 다른 분류 카드는 숨겨지고, 전체를 누르면 모두 보임 | project filter |
| 4 | 프로젝트 카드 펼치기 | 구현 내용과 GitHub 저장소 링크 | project cards expand |
| 5 | 연락처 | 메일 링크와 GitHub 주소 | contact links |