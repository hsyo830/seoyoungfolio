import { chromium } from 'playwright';

const PORT = 3001;
const OUT = 'C:/Users/nct83/AppData/Local/Temp';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' });

// Find Projects section
const projectsScrollY = await page.evaluate(() => {
  const sections = [...document.querySelectorAll('section')];
  for (const s of sections) {
    if (s.scrollHeight > window.innerHeight * 3) {
      return s.getBoundingClientRect().top + window.scrollY;
    }
  }
  return 0;
});
console.log('Projects section starts at scrollY:', projectsScrollY);

// ---- Helper: inspect squares on a card ----
async function inspectCard(scrollY, cardLabel) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(2000); // wait for card-in animation

  const result = await page.evaluate((label) => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Find all cards (100vw wide, ~100vh tall)
    const cards = [...document.querySelectorAll('div')].filter(el => {
      const s = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return (
        Math.abs(r.width - vw) < 5 &&
        Math.abs(r.height - vh) < 5 &&
        s.position === 'relative' &&
        s.overflow === 'hidden'
      );
    });

    const card = cards[0]; // should be the visible card
    if (!card) return { error: 'No card found', allDivCount: document.querySelectorAll('div').length };

    const cardRect = card.getBoundingClientRect();

    // Find square markers: position:absolute, width/height ~32px, dashed border
    const squares = [...card.querySelectorAll('div')].filter(el => {
      const s = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return (
        s.position === 'absolute' &&
        Math.abs(r.width - 32) < 4 &&
        Math.abs(r.height - 32) < 4 &&
        s.borderStyle === 'dashed'
      );
    });

    return {
      label,
      cardRect: {
        left: Math.round(cardRect.left),
        top: Math.round(cardRect.top),
        right: Math.round(cardRect.right),
        bottom: Math.round(cardRect.bottom),
        width: Math.round(cardRect.width),
        height: Math.round(cardRect.height),
      },
      squareCount: squares.length,
      squares: squares.map((el, i) => {
        const r = el.getBoundingClientRect();
        const s = window.getComputedStyle(el);
        return {
          i,
          rect: {
            left: Math.round(r.left), top: Math.round(r.top),
            right: Math.round(r.right), bottom: Math.round(r.bottom),
            width: Math.round(r.width), height: Math.round(r.height),
          },
          opacity: s.opacity,
          visibility: s.visibility,
          display: s.display,
          zIndex: s.zIndex,
          transform: s.transform,
          borderStyle: s.borderStyle,
          borderWidth: s.borderTopWidth,
          borderColor: s.borderTopColor,
          pointerEvents: s.pointerEvents,
          isInViewport: r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0,
          isInsideCard: r.top >= cardRect.top - 1 && r.bottom <= cardRect.bottom + 1 &&
                        r.left >= cardRect.left - 1 && r.right <= cardRect.right + 1,
        };
      }),
    };
  }, cardLabel);

  return result;
}

// ---- Card 0 (직관GO, 3 squares) ----
const card0ScrollY = projectsScrollY + 500 + 100; // well into card 0
const card0Data = await inspectCard(card0ScrollY, 'Card 0 - 직관GO (expect 3 squares)');
await page.screenshot({ path: `${OUT}/sq_card0.png`, fullPage: false });
console.log('\n=== CARD 0 ===');
console.log(JSON.stringify(card0Data, null, 2));

// ---- Card 1 (Global Nomad, 4 squares) ----
const card1ScrollY = projectsScrollY + 500 + 1440 + 200; // card 1
const card1Data = await inspectCard(card1ScrollY, 'Card 1 - Global Nomad (expect 4 squares)');
await page.screenshot({ path: `${OUT}/sq_card1.png`, fullPage: false });
console.log('\n=== CARD 1 ===');
console.log(JSON.stringify(card1Data, null, 2));

// ---- Deep DOM inspection: look for ALL dashed divs regardless of size ----
const deepScan = await page.evaluate(() => {
  const dashedDivs = [...document.querySelectorAll('div')].filter(el => {
    const s = window.getComputedStyle(el);
    return s.borderStyle === 'dashed' && s.position === 'absolute';
  });

  return {
    totalDashedAbsoluteDivs: dashedDivs.length,
    items: dashedDivs.map(el => {
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        width: Math.round(r.width),
        height: Math.round(r.height),
        opacity: s.opacity,
        zIndex: s.zIndex,
        borderWidth: s.borderTopWidth,
        transform: s.transform.slice(0, 50),
        inViewport: r.top < window.innerHeight && r.bottom > 0,
      };
    }),
  };
});
console.log('\n=== ALL DASHED ABSOLUTE DIVS (from card 1 position) ===');
console.log(JSON.stringify(deepScan, null, 2));

// ---- Check cardRefsMap by looking at squareRefs via GSAP targets ----
// Check GSAP state on the square elements
const gsapState = await page.evaluate(() => {
  // Find squares by style heuristic
  const allDivs = [...document.querySelectorAll('div')];
  const squares = allDivs.filter(el => {
    const s = window.getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return s.position === 'absolute' && Math.abs(r.width - 32) < 4 && Math.abs(r.height - 32) < 4;
  });

  return {
    count: squares.length,
    details: squares.map(el => {
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        rect: { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left) },
        inlineStyle: el.getAttribute('style'),
        opacity: s.opacity,
        zIndex: s.zIndex,
      };
    }),
  };
});
console.log('\n=== ALL 32x32 ABSOLUTE DIVS IN DOM ===');
console.log(JSON.stringify(gsapState, null, 2));

await browser.close();
console.log(`\nScreenshots saved to ${OUT}/sq_card0.png and sq_card1.png`);
