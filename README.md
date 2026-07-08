🎨 seoyoungfolio
Next.js와 GSAP으로 구현한 인터랙티브 프론트엔드 개발자 포트폴리오

Vercel Next.js TypeScript GSAP

seoyoungfolio 미리보기

🔗 Demo | https://seoyoungfolio-mu.vercel.app
🔗 GitHub | https://github.com/hsyo830/seoyoungfolio

🎨 프로젝트 개요
WebGL 그라디언트 배경, GSAP ScrollTrigger 기반 가로 스크롤 프로젝트 섹션, SVG 타임라인 Experience 섹션 등 복잡한 인터랙션으로 구현한 개인 브랜딩 포트폴리오 사이트
베이지·차콜 컬러 팔레트와 오렌지(#ea5d2a) 포인트 컬러로 일관된 비주얼 아이덴티티 구축
Claude Code를 디렉팅하여 복잡한 인터랙션 구현을 함께 진행

🎨 기술 스택
구분	사용 기술
개발 환경	VS Code · ESLint · Prettier · Git & GitHub
프레임워크	Next.js · React · TypeScript
스타일링	Tailwind CSS
애니메이션	GSAP (ScrollTrigger) · Framer Motion
그래픽	WebGL 그라디언트 배경 · SVG 타임라인
빌드/배포	Next.js Build · Vercel

🎨 프로젝트 실행 방법
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

🎨 주요 기능
기능	설명
Hero	WebGL 기반 그라디언트 배경으로 첫인상을 강조하는 인트로 섹션
Projects	GSAP ScrollTrigger 기반 가로 스크롤 프로젝트 카드, 상단 sticky PROJECTS 마퀴
Experience	SVG 타임라인으로 구성한 경력·프로젝트 이력 섹션
Skills	기술 스택을 원형 궤도로 회전시키는 오비탈(Orbital) 애니메이션
프로젝트 설명	각 프로젝트별 한글 서브타이틀로 맥락 전달
디자인 시스템	베이지(#EFEDE7) 배경과 차콜 텍스트, 오렌지(#ea5d2a) 포인트 컬러 기반 톤앤매너

🎨 GitHub 브랜치 전략
브랜치	용도	비고
main	최종 배포용	운영 환경
develop	기능 통합용	테스트 / 통합
feature/*	기능별 작업용	개인 작업 브랜치

🎨 Commit 컨벤션
타입	설명	예시
feat	새로운 기능 추가	feat: 가로 스크롤 프로젝트 섹션 추가
fix	버그 수정	fix: 레이아웃 오버플로우 버그 수정
style	코드 포맷팅 변경	style: 들여쓰기 수정
refactor	기능 변화 없는 리팩토링	refactor: 애니메이션 훅 로직 분리
docs	문서 수정	docs: README 수정
chore	빌드/설정 관련 변경	chore: ESLint 설정 수정

🗂️ 프로젝트 구조
src/
├── app/                  # Next.js App Router
│   ├── (main)/           # 메인 레이아웃 그룹
│   │   ├── projects/     # 프로젝트 섹션
│   │   ├── experience/   # 경력 타임라인 섹션
│   │   └── skills/       # 스킬 오비탈 섹션
│   └── api/              # Route Handlers
├── components/           # 공통 컴포넌트
├── hooks/                # 커스텀 훅 (GSAP ScrollTrigger 등)
├── animations/           # GSAP 타임라인 · 인터랙션 정의
├── types/                # TypeScript 타입 정의
└── utils/                # 유틸리티 함수
