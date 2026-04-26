const { generateOutfits, OCCASIONS } = require('../src/lib/outfitSchema');
const { getBodyTypeAdvice } = require('../src/lib/bodyTypeAdvice');
const { COLOR_SEASONS } = require('../src/lib/constants');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// Check 1: all occasions generate 4 outfits for PRO
OCCASIONS.forEach(occ => {
  const set = generateOutfits('True Autumn', 'oval', {}, 'feminine', 'global-western', occ, 'pro');
  (set.outfits.length === 4) ? pass(`occasion:${occ}`) : fail(`occasion:${occ} returned ${set.outfits.length} outfits`);
});

// Check 2: FREE tier gates correctly
const freeSet = generateOutfits('True Winter', 'round', {}, 'feminine', 'global-western', 'everyday casual', 'free');
(freeSet.shown === 2 && freeSet.locked === 2 && freeSet.tier === 'free') ? pass('tier:free') : fail('tier:free gating wrong');

// Check 3: PRO tier gates correctly
const proSet = generateOutfits('True Winter', 'round', {}, 'feminine', 'global-western', 'everyday casual', 'pro');
(proSet.shown === 4 && proSet.locked === 0 && proSet.tier === 'pro') ? pass('tier:pro') : fail('tier:pro gating wrong');

// Check 4: masculine outfits have top+bottom
const mascSet = generateOutfits('Bright Spring', 'square', {}, 'masculine', 'global-western', 'work professional', 'pro');
const mascItems = mascSet.outfits[0].items;
(mascItems.some(i => i.category === 'Top') && mascItems.some(i => i.category === 'Bottom'))
  ? pass('gender:masculine')
  : fail('gender:masculine missing top or bottom');

// Check 5: cultural context applied
const cultSet = generateOutfits('Soft Summer', 'heart', {}, 'feminine', 'south-asian', 'wedding guest', 'pro');
(cultSet.outfits[0].culturalContext === 'south-asian' && cultSet.outfits[0].styleNotes.length > 10)
  ? pass('cultural:south-asian')
  : fail('cultural:south-asian missing notes');

// Check 6: all hex codes valid
const hexRegex = /^#[0-9A-Fa-f]{6}$/;
let hexValid = true;
const hexSet = generateOutfits('True Spring', 'oval', {}, 'feminine', 'global-western', 'date night', 'pro');
hexSet.outfits.forEach(o => {
  o.items.forEach(item => {
    item.suggestedColors.forEach(hex => {
      if (!hexRegex.test(hex)) { hexValid = false; fail(`invalid hex:${hex}`); }
    });
  });
});
if (hexValid) pass('hex:all-valid');

// Check 7: outfit IDs unique
const idSet = new Set(hexSet.outfits.map(o => o.id));
(idSet.size === hexSet.outfits.length) ? pass('ids:unique') : fail('ids:duplicate');

// Check 8: body type advice for all shapes
['balanced', 'broad-shoulders', 'broad-hips', 'narrow'].forEach(shape => {
  const advice = getBodyTypeAdvice({ shoulderToHip: shape });
  (advice.bodyShape && advice.fitAdvice.length > 0 && advice.recommendedShapes.length > 0)
    ? pass(`bodyType:${shape}`)
    : fail(`bodyType:${shape} incomplete`);
});

// Check 9: height adjustments
const petite = getBodyTypeAdvice({ height: 'petite' });
(petite.proportionTips.some(t => t.toLowerCase().includes('elongate'))) ? pass('height:petite') : fail('height:petite');

const tall = getBodyTypeAdvice({ height: 'tall' });
(tall.proportionTips.some(t => t.toLowerCase().includes('bold'))) ? pass('height:tall') : fail('height:tall');

// Check 10: torso adjustments
const longTorso = getBodyTypeAdvice({ torsoLength: 'long' });
(longTorso.proportionTips.some(t => t.toLowerCase().includes('high-waisted'))) ? pass('torso:long') : fail('torso:long');

const shortTorso = getBodyTypeAdvice({ torsoLength: 'short' });
(shortTorso.proportionTips.some(t => t.toLowerCase().includes('elongate'))) ? pass('torso:short') : fail('torso:short');

// Check 11: build mapping
(getBodyTypeAdvice({ build: 'curvy' }).bodyShape === 'hourglass') ? pass('build:curvy') : fail('build:curvy');
(getBodyTypeAdvice({ build: 'athletic' }).bodyShape === 'athletic') ? pass('build:athletic') : fail('build:athletic');

// Check 12: all 12 seasons generate without throwing
COLOR_SEASONS.forEach(season => {
  try {
    const s = generateOutfits(season, 'oval', {}, 'feminine', 'global-western', 'everyday casual', 'pro');
    (s.outfits.length === 4) ? pass(`season:${season}`) : fail(`season:${season}`);
  } catch(e) { fail(`season:${season} threw: ${e.message}`); }
});

console.log(`\nSTYLE_AGENT Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
