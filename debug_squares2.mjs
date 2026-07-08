import { chromium } from 'playwright';

const PORT = 3001;
const OUT = 'C:/Users/nct83/AppData/Local/Temp';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' });

const projectsScrollY = await page.evaluate(() => {
  const sections = [...document.querySelectorAll('section')];
  for (const s of sections) {
    if (s.scrollHeight > window.innerHeight * 3) {
      return s.getBoundingClientRect().top + window.scrollY;
    }
  }
  return 0;
});
console.log('Projects section scrollY:', projectsScrollY);

// Scroll into card 1 range but in the MIDDLE of card 1
// Card 1 center: ENTRY_DWELL + 1.5 * vw = 500 + 1.5*1440 = 2660px into the pin
const card1ScrollY = projectsScrollY + 500 + 2160; // 1.5 cards in
console.log('Scrolling to card1 position:', card1ScrollY);
await page.evaluate((y) => window.scrollTo(0, y), card1ScrollY);
await page.waitForTimeout(3000); // extra wait for GSAP scrub

await page.screenshot({ path: `${OUT}/sq2_card1.png`, fullPage: false });

const analysis = await page.evaluate(() => {
  // 1. Find all 32px dashed divs (our squares)
  const squares32 = [...document.querySelectorAll('div')].filter(el => {
    const r = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    return s.position === 'absolute' && Math.round(r.width) === 32 && Math.round(r.height) === 32 && s.borderTopStyle === 'dashed';
  });

  // 2. For each square, trace offsetParent chain
  function traceAncestors(el) {
    const chain = [];
    let current = el.offsetParent;
    let depth = 0;
    while (current && depth < 10) {
      const r = current.getBoundingClientRect();
      const s = window.getComputedStyle(current);
      chain.push({
        tag: current.tagName,
        id: current.id || '',
        className: (current.className || '').slice(0, 40),
        position: s.position,
        transform: s.transform.slice(0, 60),
        overflow: s.overflow,
        rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
        offsetTop: current.offsetTop,
        offsetLeft: current.offsetLeft,
      });
      current = current.offsetParent;
      depth++;
    }
    return chain;
  }

  // 3. For each square, get offsetTop/Left relative to offsetParent
  const squareDetails = squares32.map((el, i) => {
    const r = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    const inlineStyle = el.getAttribute('style') || '';
    const ancestors = traceAncestors(el);

    // Directly measure offsetParent
    const op = el.offsetParent;
    const opRect = op ? op.getBoundingClientRect() : null;

    return {
      i,
      viewportRect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
      opacity: s.opacity,
      zIndex: s.zIndex,
      borderWidth: s.borderTopWidth,
      inlineStyleSnippet: inlineStyle.slice(0, 120),
      offsetTop: el.offsetTop,
      offsetLeft: el.offsetLeft,
      offsetParentTag: op ? op.tagName : 'null',
      offsetParentRect: opRect ? { top: Math.round(opRect.top), left: Math.round(opRect.left), w: Math.round(opRect.width), h: Math.round(opRect.height) } : null,
      ancestorChain: ancestors,
    };
  });

  // 4. Find section + track + cards
  const section = document.querySelector('section[style*="relative"]') ||
                  [...document.querySelectorAll('section')].find(el => el.scrollHeight > 2000);
  const sectionRect = section ? section.getBoundingClientRect() : null;
  const sectionStyle = section ? window.getComputedStyle(section) : null;

  // Find the track (width: 400vw div)
  const track = [...document.querySelectorAll('div')].find(el => {
    const s = window.getComputedStyle(el);
    return s.width && parseFloat(s.width) > window.innerWidth * 3;
  });
  const trackRect = track ? track.getBoundingClientRect() : null;
  const trackStyle = track ? window.getComputedStyle(track) : null;

  return {
    scrollY: window.scrollY,
    viewport: { w: window.innerWidth, h: window.innerHeight },
    section: section ? {
      rect: { top: Math.round(sectionRect.top), left: Math.round(sectionRect.left), w: Math.round(sectionRect.width), h: Math.round(sectionRect.height) },
      position: sectionStyle.position,
      transform: sectionStyle.transform.slice(0, 80),
      overflow: sectionStyle.overflow,
      offsetTop: section.offsetTop,
    } : null,
    track: track ? {
      rect: { top: Math.round(trackRect.top), left: Math.round(trackRect.left), w: Math.round(trackRect.width), h: Math.round(trackRect.height) },
      position: trackStyle.position,
      transform: trackStyle.transform.slice(0, 80),
      offsetTop: track.offsetTop,
    } : null,
    squareCount: squares32.length,
    squares: squareDetails,
  };
});

console.log('\n=== ANCHOR ANALYSIS ===');
console.log('scrollY:', analysis.scrollY);
console.log('section:', JSON.stringify(analysis.section, null, 2));
console.log('track:', JSON.stringify(analysis.track, null, 2));
console.log('squareCount:', analysis.squareCount);

// Only log animated squares (opacity 1)
const animated = analysis.squares.filter(s => s.opacity === '1' && s.zIndex === '4');
console.log('\n=== ANIMATED SQUARES (opacity:1, zIndex:4) ===');
animated.forEach(sq => {
  console.log(`Square ${sq.i}:`);
  console.log(`  viewport rect: top=${sq.viewportRect.top}, left=${sq.viewportRect.left}`);
  console.log(`  offsetTop: ${sq.offsetTop}, offsetLeft: ${sq.offsetLeft}`);
  console.log(`  offsetParent: ${sq.offsetParentTag}, parentRect: top=${sq.offsetParentRect?.top}, left=${sq.offsetParentRect?.left}, h=${sq.offsetParentRect?.h}`);
  console.log(`  inline style: ${sq.inlineStyleSnippet}`);
  console.log(`  ancestor chain:`);
  sq.ancestorChain.forEach((a, depth) => {
    console.log(`    [${depth}] ${a.tag} pos=${a.position} transform=${a.transform} rect.top=${a.rect.top} offsetTop=${a.offsetTop}`);
  });
});

await browser.close();
console.log('\nDone. Screenshot at', `${OUT}/sq2_card1.png`);
