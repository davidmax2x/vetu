const { generateOutfits, OCCASIONS } = require('../src/lib/outfitSchema');
const { getBodyTypeAdvice } = require('../src/lib/bodyTypeAdvice');
const { COLOR_SEASONS } = require('../src/lib/constants');
const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// CP2.1: all 12 seasons × 12 occasions generate without throwing
COLOR_SEASONS.forEach(season => {
  OCCASIONS.forEach(occasion => {
    try {
      const set = generateOutfits(season, 'oval', {}, 'feminine', 'global-western', occasion, 'pro');
      if (set.outfits.length === 4) pass(`season:${season},occasion:${occasion}`);
      else fail(`season:${season},occasion:${occasion} returned ${set.outfits.length} outfits`);
    } catch(e) { fail(`season:${season},occasion:${occasion} threw: ${e.message}`); }
  });
});

// CP2.2: all outfits have required fields
const requiredFields = ['id','name','occasion','description','items','colorSeason','culturalContext','gender','styleNotes','shoppingQuery'];
const sample = generateOutfits('True Autumn', 'oval', {}, 'feminine', 'global-western', 'work professional', 'pro');
sample.outfits.forEach((outfit, i) => {
  requiredFields.forEach(field => {
    (outfit[field] !== undefined) ? pass(`outfit[${i}].${field}`) : fail(`outfit[${i}].${field} missing`);
  });
});

// CP2.3: each outfit has at least 2 items
sample.outfits.forEach((outfit, i) => {
  (outfit.items.length >= 2) ? pass(`outfit[${i}].items>=2`) : fail(`outfit[${i}].items=${outfit.items.length}`);
});

// CP2.4: tier gating
const freeSet = generateOutfits('True Winter', 'round', {}, 'feminine', 'global-western', 'everyday casual', 'free');
(freeSet.shown === 2 && freeSet.locked === 2 && freeSet.tier === 'free') ? pass('tier:free') : fail('tier:free');

const proSet = generateOutfits('True Winter', 'round', {}, 'feminine', 'global-western', 'everyday casual', 'pro');
(proSet.shown === 4 && proSet.locked === 0 && proSet.tier === 'pro') ? pass('tier:pro') : fail('tier:pro');

// CP2.5: body type advice for all shape inputs
const shapes = ['balanced', 'broad-shoulders', 'broad-hips', 'narrow'];
shapes.forEach(shape => {
  try {
    const advice = getBodyTypeAdvice({ shoulderToHip: shape });
    (advice.bodyShape && advice.fitAdvice.length > 0) ? pass(`bodyType:${shape}`) : fail(`bodyType:${shape} incomplete`);
  } catch(e) { fail(`bodyType:${shape} threw: ${e.message}`); }
});

// CP2.6: all hex codes valid
const hexRegex = /^#[0-9A-Fa-f]{6}$/;
let hexValid = true;
COLOR_SEASONS.slice(0, 3).forEach(season => {
  const set = generateOutfits(season, 'oval', {}, 'feminine', 'global-western', 'date night', 'pro');
  set.outfits.forEach(o => {
    o.items.forEach(item => {
      item.suggestedColors.forEach(hex => {
        if (!hexRegex.test(hex)) { hexValid = false; fail(`invalid hex:${hex}`); }
      });
    });
  });
});
if (hexValid) pass('hex:all-valid-sample');

// CP2.7: masculine outfits have distinct items from feminine
const femSet = generateOutfits('True Spring', 'oval', {}, 'feminine', 'global-western', 'work professional', 'pro');
const mascSet = generateOutfits('True Spring', 'oval', {}, 'masculine', 'global-western', 'work professional', 'pro');
const femNames = femSet.outfits[0].items.map(i => i.name).join(',');
const mascNames = mascSet.outfits[0].items.map(i => i.name).join(',');
(femNames !== mascNames) ? pass('gender:distinct') : fail('gender:distinct');

// CP2.8: cultural context alternatives present where expected
const saWedding = generateOutfits('Soft Summer', 'heart', {}, 'feminine', 'south-asian', 'wedding guest', 'pro');
(saWedding.outfits[0].items.some(i => i.category === 'Alternative')) ? pass('cultural:alternative') : fail('cultural:alternative');

// CP2.9: API route file exists and is non-empty
const apiPath = path.join(__dirname, '../src/app/api/recommend/route.ts');
if (fs.existsSync(apiPath) && fs.statSync(apiPath).size > 0) pass('api:recommend-exists');
else fail('api:recommend-exists');

// CP2.10: OutfitCard component exists
const cardPath = path.join(__dirname, '../src/components/OutfitCard.tsx');
if (fs.existsSync(cardPath) && fs.statSync(cardPath).size > 0) pass('component:OutfitCard-exists');
else fail('component:OutfitCard-exists');

console.log(`\nCP2 Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
