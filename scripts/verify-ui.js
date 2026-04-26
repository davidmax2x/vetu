const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// UI.1: All UI component files exist
const components = [
  'components/StepFlow.tsx',
  'components/PhotoCapture.tsx',
  'components/ColorPalette.tsx',
  'components/ColorSwatch.tsx',
  'components/OutfitCard.tsx',
  'components/TryOnModal.tsx',
  'components/billing/UpgradeModal.tsx',
  'components/advisor/Chat.tsx',
  'components/auth/SignInButton.tsx',
  'components/auth/UserMenu.tsx',
];

components.forEach(file => {
  const p = path.join(__dirname, '../src', file);
  fs.existsSync(p) ? pass(`component:${file}`) : fail(`component:${file}`);
});

// UI.2: page.tsx uses StepFlow
const pagePath = path.join(__dirname, '../src/app/page.tsx');
if (fs.existsSync(pagePath)) {
  const content = fs.readFileSync(pagePath, 'utf8');
  content.includes('StepFlow') ? pass('page:uses-stepflow') : fail('page:uses-stepflow');
} else {
  fail('page:file');
}

// UI.3: Store has all required fields
const storePath = path.join(__dirname, '../src/store/useStyleStore.ts');
if (fs.existsSync(storePath)) {
  const content = fs.readFileSync(storePath, 'utf8');
  ['outfits', 'palette', 'styleRecs', 'tier', 'tryOnImages', 'savedOutfits', 'advisorOpen', 'estimatedCost']
    .forEach(field => {
      content.includes(field) ? pass(`store:${field}`) : fail(`store:${field}`);
    });
} else {
  fail('store:file');
}

// UI.4: StepFlow manages required steps
const stepFlowPath = path.join(__dirname, '../src/components/StepFlow.tsx');
if (fs.existsSync(stepFlowPath)) {
  const content = fs.readFileSync(stepFlowPath, 'utf8');
  ['capture', 'preferences', 'analyzing', 'results'].forEach(step => {
    content.includes(step) ? pass(`stepflow:${step}`) : fail(`stepflow:${step}`);
  });
  content.includes('PhotoCapture') ? pass('stepflow:photocapture') : fail('stepflow:photocapture');
  content.includes('ColorPalette') ? pass('stepflow:colorpalette') : fail('stepflow:colorpalette');
  content.includes('OutfitCard') ? pass('stepflow:outfitcard') : fail('stepflow:outfitcard');
  content.includes('AdvisorChat') || content.includes('advisor/Chat') ? pass('stepflow:advisor') : fail('stepflow:advisor');
  content.includes('UpgradeModal') || content.includes('billing/UpgradeModal') ? pass('stepflow:upgrademodal') : fail('stepflow:upgrademodal');
  content.includes('TryOnModal') ? pass('stepflow:tryonmodal') : fail('stepflow:tryonmodal');
} else {
  fail('stepflow:file');
}

// UI.5: Build output exists
const buildOutput = path.join(__dirname, '../.next/server/app');
fs.existsSync(buildOutput) ? pass('build:output-exists') : fail('build:output-exists');

console.log(`\nUI Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
