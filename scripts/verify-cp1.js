const { COLOR_SEASONS } = require('../src/lib/constants');
const { getPalette, validateHex } = require('../src/lib/colorPalettes');
const { getStyleRecommendations } = require('../src/lib/styleRecommendations');
const { getCulturalStyleNotes } = require('../src/lib/culturalContext');
const { CULTURAL_CONTEXTS } = require('../src/lib/constants');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// Check 1: all 12 seasons have palettes
COLOR_SEASONS.forEach(s => {
  const p = getPalette(s);
  (p && p.best && p.best.length >= 8) ? pass(`palette:${s}`) : fail(`palette:${s}`);
});

// Check 2: all palette hex codes are valid
COLOR_SEASONS.forEach(s => {
  const p = getPalette(s);
  [...p.best, ...p.neutral, ...p.avoid].forEach(hex => {
    validateHex(hex) ? pass(`hex:${hex}`) : fail(`invalid hex in ${s}: ${hex}`);
  });
});

// Check 3: getStyleRecommendations accepts all faceShapes
['oval','round','square','heart','oblong','diamond'].forEach(shape => {
  try {
    const r = getStyleRecommendations('True Autumn', shape, {}, 'feminine', 'global-western');
    r && r.necklineAdvice ? pass(`faceShape:${shape}`) : fail(`no necklineAdvice for ${shape}`);
  } catch(e) { fail(`faceShape:${shape} threw: ${e.message}`); }
});

// Check 4: cultural context notes
CULTURAL_CONTEXTS.forEach(ctx => {
  const notes = getCulturalStyleNotes(ctx, 'True Autumn');
  notes && notes.length > 10 ? pass(`cultural:${ctx}`) : fail(`cultural:${ctx} returned empty`);
});

console.log(`\nCP1 Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
