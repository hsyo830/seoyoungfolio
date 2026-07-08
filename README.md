<div align="left">

# 🎨 seoyoungfolio

**Next.js와 GSAP으로 구현한 인터랙티브 프론트엔드 개발자 포트폴리오입니다.**

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

<br/>

<img width="532" height="870" alt="image" src="여기에_스크린샷_이미지_URL을_붙여넣으세요" />

---

## 프로젝트 개요

- WebGL 그라디언트 배경으로 첫인상을 강조하는 인터랙티브 Hero 섹션
- GSAP ScrollTrigger 기반 가로 스크롤 프로젝트 카드와 상단 sticky PROJECTS 마퀴
- SVG 타임라인으로 구성한 Experience 섹션 및 기술 스택을 원형 궤도로 회전시키는 오비탈(Orbital) Skills 애니메이션

<br>

## 개발자 소개

| <img src="https://avatars.githubusercontent.com/hsyo830" width="100px" /> |
| :-----------------------------------------------------------------------: |
|                                **황서영**                                 |
|                  [@hsyo830](https://github.com/hsyo830)                   |

<br>

## 기술 스택

| 구분           | 사용 기술                                  |
| -------------- | ------------------------------------------ |
| **개발 환경**  | VS Code · ESLint · Prettier · Git & GitHub |
| **프레임워크** | Next.js · React · TypeScript               |
| **스타일링**   | Tailwind CSS                               |
| **애니메이션** | GSAP (ScrollTrigger) · Framer Motion       |
| **그래픽**     | WebGL 그라디언트 배경 · SVG 타임라인       |
| **빌드/배포**  | Next.js Build · Vercel                     |

<br>

## 프로젝트 실행 방법

```
# 패키지 설치
npm install
# 로컬 개발 서버
npm run dev
# ESLint 규칙 검사
npm run lint
# 프로덕션 빌드
npm run build
# 프로덕션 서버 실행
npm run start
```

<br>

## GitHub 브랜치 전략

| 브랜치         | 용도          | 비고             |
| -------------- | ------------- | ---------------- |
| **main**       | 최종 배포용   | 운영 환경        |
| **develop**    | 기능 통합용   | 테스트 / 통합    |
| **feature/\*** | 기능별 작업용 | 개인 작업 브랜치 |

<br>

## Commit 컨벤션

| 타입         | 설명                    | 예시                                   |
| ------------ | ----------------------- | -------------------------------------- |
| **Feat**     | 새로운 기능 추가        | `Feat: 가로 스크롤 프로젝트 섹션 추가` |
| **Fix**      | 버그 수정               | `Fix: 레이아웃 오버플로우 버그 수정`   |
| **Style**    | 코드 포맷팅 변경        | `Style: 들여쓰기 및 코드 정렬 수정`    |
| **Refactor** | 기능 변화 없는 리팩토링 | `Refactor: 애니메이션 훅 로직 분리`    |
| **Docs**     | 문서 수정               | `Docs: README 수정`                    |
| **Chore**    | 빌드/설정 관련 변경     | `Chore: ESLint 설정 파일 수정`         |
| **Test**     | 테스트 코드 추가/수정   | `Test: 스크롤 트리거 훅 테스트 추가`   |

</div>
