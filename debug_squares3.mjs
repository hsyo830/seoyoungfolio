import { chromium } from 'playwright';

const PORT = 3001;
const OUT = 'C:/Users/nct83/AppData/Local/Temp';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' });

// Find the ACTUAL pin spacer that wraps the Projects section
// Look for the div that contains the track (400vw wide div)
const pinInfo = await page.evaluate(() => {
  // Find the track (div with display:flex and 4 card children)
  const track = [...document.querySelectorAll('div')].find(el => {
    const s = window.getComputedStyle(el);
    return s.width && parseFloat(s.width) > window.innerWidth * 3.5;
  });
  if (!track) return { error: 'No track found' };

  // Walk UP from track to find the pin spacer (direct child of body/main scroll container)
  // Also find the projects section
  const section = track.parentElement;

  // Find the pin spacer (parent of section, or section itself if no wrapper)
  let pinSpacer = section;
  let depth = 0;
  while (pinSpacer.parentElement && !['BODY', 'HTML', 'MAIN'].includes(pinSpacer.parentElement.tagName) && depth < 5) {
    const parentStyle = window.getComputedStyle(pinSpacer.parentElement);
    // GSAP pin spacer typically has large height
    const parentHeight = parseFloat(parentStyle.height);
    if (parentHeight > window.innerHeight * 3) {
      pinSpacer = pinSpacer.parentElement;
      break;
    }
    pinSpacer = pinSpacer.parentElement;
    depth++;
  }

  // Get the document y of the pin spacer (at scrollY=0, this is the scroll position where the Projects section appears)
  const pinSpacerRect = pinSpacer.getBoundingClientRect();
  const pinSpacerDocTop = pinSpacerRect.top + window.scrollY;
  const pinSpacerHeight = parseFloat(window.getComputedStyle(pinSpacer).height);

  const trackRect = track.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();

  return {
    scrollY: window.scrollY,
    pinSpacer: {
      tag: pinSpacer.tagName,
      docTop: pinSpacerDocTop,
      rect: { top: Math.round(pinSpacerRect.top), h: Math.round(pinSpacerRect.height) },
      height: pinSpacerHeight,
    },
    section: {
      tag: section.tagName,
      rect: { top: Math.round(sectionRect.top), h: Math.round(sectionRect.height) },
      docTop: sectionRect.top + window.scrollY,
    },
    track: {
      rect: { top: Math.round(trackRect.top), left: Math.round(trackRect.left), w: Math.round(trackRect.width) },
    },
  };
});

console.log('Pin info at scrollY=0:', JSON.stringify(pinInfo, null, 2));

const pinStart = pinInfo.pinSpacer?.docTop ?? 7092;
console.log('Pin starts at scrollY:', pinStart);
console.log('Pin ends at scrollY:', pinStart + 5220);

// Scroll to the CENTER of card 1 range within the pin
// Card 1 occupies: pinStart + ENTRY_DWELL(500) + 1*vw(1440) to pinStart + ENTRY_DWELL + 2*vw
// Use the midpoint: pinStart + 500 + 1440 + 720 = pinStart + 2660
const card1Mid = pinStart + 500 + 1440 + 720;
console.log('Scrolling to card 1 midpoint:', card1Mid);

await page.evaluate((y) => window.scrollTo(0, y), card1Mid);
await page.waitForTimeout(3000);
await page.screenshot({ path: `${OUT}/sq3_card1.png`, fullPage: false });

// Inspect the state at card1Mid
const state1 = await page.evaluate(() => {
  const track = [...document.querySelectorAll('div')].find(el => {
    const r = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    return parseFloat(s.width) > window.innerWidth * 3.5;
  });

  const section = track?.parentElement;
  const sectionStyle = section ? window.getComputedStyle(section) : null;
  const trackStyle = track ? window.getComputedStyle(track) : null;
  const sectionRect = section ? section.getBoundingClientRect() : null;
  const trackRect = track ? track.getBoundingClientRect() : null;

  // Find all 32px dashed divs (squares)
  const allSquares = [...document.querySelectorAll('div')].filter(el => {
    const r = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    return s.position === 'absolute' &&
           s.borderTopStyle === 'dashed' &&
           Math.round(r.width) === 32 &&
           Math.round(r.height) === 32;
  });

  return {
    scrollY: window.scrollY,
    section: sectionStyle ? {
      transform: sectionStyle.transform.slice(0, 80),
      rect: sectionRect ? { top: Math.round(sectionRect.top), left: Math.round(sectionRect.left) } : null,
    } : null,
    track: trackStyle ? {
      transform: trackStyle.transform.slice(0, 80),
      rect: trackRect ? { top: Math.round(trackRect.top), left: Math.round(trackRect.left) } : null,
    } : null,
    squaresAll: allSquares.map(el => {
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        top: Math.round(r.top),
        left: Math.round(r.left),
        opacity: s.opacity,
        zIndex: s.zIndex,
        borderWidth: s.borderTopWidth,
        inViewport: r.top < 900 && r.bottom > 0 && r.left < 1440 && r.right > 0,
      };
    }),
  };
});

console.log('\n=== STATE AT CARD 1 MIDPOINT ===');
console.log('scrollY:', state1.scrollY);
console.log('section:', state1.section);
console.log('track:', state1.track);
console.log('squaresAll:');
state1.squaresAll.forEach((sq, i) => {
  const tag = sq.opacity === '1' && sq.zIndex === '4' ? '[ANIMATED]' : sq.zIndex === 'auto' ? '[OTHER SECTION]' : '[inactive]';
  console.log(`  ${tag} top=${sq.top} left=${sq.left} opacity=${sq.opacity} zIdx=${sq.zIndex} border=${sq.borderWidth} inVP=${sq.inViewport}`);
});

const inVPCount = state1.squaresAll.filter(s => s.inViewport).length;
const ourSquaresCount = state1.squaresAll.filter(s => s.zIndex === '4').length;
const ourSquaresInVP = state1.squaresAll.filter(s => s.zIndex === '4' && s.inViewport).length;
console.log(`\nSummary: ${inVPCount} in viewport, ${ourSquaresCount} our squares (z-index:4), ${ourSquaresInVP} of ours in viewport`);

// Also check card 0 (직관GO, 3 squares expected)
const card0Mid = pinStart + 500 + 720;
console.log('\nScrolling to card 0 midpoint:', card0Mid);
await page.evaluate((y) => window.scrollTo(0, y), card0Mid);
await page.waitForTimeout(3000);
await page.screenshot({ path: `${OUT}/sq3_card0.png`, fullPage: false });

const state0 = await page.evaluate(() => {
  const allSquares = [...document.querySelectorAll('div')].filter(el => {
    const r = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    return s.position === 'absolute' && s.borderTopStyle === 'dashed' &&
           Math.round(r.width) === 32 && Math.round(r.height) === 32;
  });
  return {
    scrollY: window.scrollY,
    track: (() => {
      const track = [...document.querySelectorAll('div')].find(el => parseFloat(window.getComputedStyle(el).width) > window.innerWidth * 3.5);
      return { transform: track ? window.getComputedStyle(track).transform.slice(0, 60) : 'n/a' };
    })(),
    squares: allSquares.map(el => {
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return { top: Math.round(r.top), left: Math.round(r.left), opacity: s.opacity, zIndex: s.zIndex, borderWidth: s.borderTopWidth, inVP: r.top < 900 && r.bottom > 0 && r.left < 1440 && r.right > 0 };
    }),
  };
});

console.log('\n=== STATE AT CARD 0 MIDPOINT ===');
console.log('scrollY:', state0.scrollY, 'track:', state0.track.transform);
state0.squares.forEach(sq => {
  const tag = sq.zIndex === '4' ? '[OUR]' : '[other]';
  console.log(`  ${tag} top=${sq.top} left=${sq.left} opacity=${sq.opacity} inVP=${sq.inVP}`);
});
console.log('Our squares in VP:', state0.squares.filter(s => s.zIndex === '4' && s.inVP).length, 'of', state0.squares.filter(s => s.zIndex === '4').length);

await browser.close();
console.log('\nDone. Screenshots at', `${OUT}/sq3_card*.png`);
