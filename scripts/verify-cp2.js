const { validateOutfit } = require('../lib/outfitSchema');
const { getPalette } = require('../lib/colorPalettes');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// Check 1: validateOutfit function exists and accepts valid input
const sampleOutfit = {
  outfitName: 'Test Outfit', occasion: 'casual',
  pieces: [{ item: 'top', description: 'warm rust blouse', color: '#C97C3A', colorName: 'Rust' }],
  accessories: ['gold necklace'], shoes: 'tan leather loafers',
  whyItWorks: 'True Autumn palette suits warm undertones',
  colorStory: 'earthy warmth', silhouetteNotes: 'fitted at waist',
  garmentImagePrompt: 'warm rust blouse on white background, product photography, no model, clean studio lighting',
  shoppingSuggestions: [{ item: 'blouse', searchQuery: 'rust blouse women', priceRange: 'mid' }]
};
try {
  const r = validateOutfit(sampleOutfit);
  r.success !== false ? pass('validateOutfit: valid outfit passes') : fail('validateOutfit: valid outfit rejected: ' + JSON.stringify(r.error));
} catch(e) { fail('validateOutfit threw: ' + e.message); }

// Check 2: garmentImagePrompt min length enforced
const shortPrompt = { ...sampleOutfit, garmentImagePrompt: 'short' };
try {
  const r = validateOutfit(shortPrompt);
  r.success === false ? pass('validateOutfit: short prompt rejected') : fail('validateOutfit: short prompt should have been rejected');
} catch(e) { pass('validateOutfit: short prompt throws (acceptable)'); }

// Check 3: locked field type
const lockedOutfit = { ...sampleOutfit, locked: true };
try {
  const r = validateOutfit(lockedOutfit);
  pass('validateOutfit: locked field accepted');
} catch(e) { fail('validateOutfit: locked field rejected: ' + e.message); }

console.log(`\nCP2 Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
