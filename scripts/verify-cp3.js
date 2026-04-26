const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// CP3.1: All API routes exist
const apiRoutes = [
  'app/api/analyze/route.ts',
  'app/api/auth/webhook/route.ts',
  'app/api/recommend/route.ts',
  'app/api/tryon/route.ts',
  'app/api/wardrobe/route.ts',
  'app/api/feedback/route.ts',
  'app/api/advisor/route.ts',
  'app/api/affiliate/track/route.ts',
  'app/api/billing/subscribe/route.ts',
  'app/api/billing/portal/route.ts',
  'app/api/billing/webhook/route.ts',
  'app/api/gdpr/export/route.ts',
  'app/api/gdpr/delete/route.ts',
];

apiRoutes.forEach(route => {
  const p = path.join(__dirname, '../src', route);
  fs.existsSync(p) ? pass(`api:${route}`) : fail(`api:${route}`);
});

// CP3.2: All core lib files exist
const libFiles = [
  'lib/constants.ts',
  'lib/utils.ts',
  'lib/colorPalettes.ts',
  'lib/styleRecommendations.ts',
  'lib/culturalContext.ts',
  'lib/outfitSchema.ts',
  'lib/bodyTypeAdvice.ts',
  'lib/imagePreprocess.ts',
  'lib/replicate.ts',
  'lib/db/client.ts',
  'lib/db/wardrobe.ts',
  'lib/db/feedback.ts',
  'lib/security/rateLimit.ts',
  'lib/security/privacy.ts',
  'lib/security/gdpr.ts',
  'lib/billing/stripe.ts',
  'lib/billing/entitlements.ts',
  'lib/affiliate/links.ts',
  'lib/advisor/engine.ts',
  'lib/auth/session.ts',
];

libFiles.forEach(file => {
  const p = path.join(__dirname, '../src', file);
  fs.existsSync(p) ? pass(`lib:${file}`) : fail(`lib:${file}`);
});

// CP3.3: All component files exist
const components = [
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

// CP3.4: Schema.sql has all required tables
const schemaPath = path.join(__dirname, '../src/lib/db/schema.sql');
if (fs.existsSync(schemaPath)) {
  const content = fs.readFileSync(schemaPath, 'utf8');
  ['users', 'entitlements', 'saved_outfits', 'feedback', 'usage'].forEach(table => {
    content.includes(table) ? pass(`schema:${table}`) : fail(`schema:${table}`);
  });
} else {
  fail('schema:file');
}

// CP3.5: Entitlement checks are present in all gated APIs
const entitlementApis = [
  { path: 'app/api/analyze/route.ts', feature: 'analyse' },
  { path: 'app/api/recommend/route.ts', feature: 'outfit_recommendation' },
  { path: 'app/api/tryon/route.ts', feature: 'tryon' },
  { path: 'app/api/wardrobe/route.ts', feature: 'wardrobe' },
  { path: 'app/api/advisor/route.ts', feature: 'advisor' },
];

entitlementApis.forEach(({ path: apiPath, feature }) => {
  const p = path.join(__dirname, '../src', apiPath);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    (content.includes('checkEntitlement') && content.includes(feature))
      ? pass(`entitlement:${feature}`)
      : fail(`entitlement:${feature}`);
  } else {
    fail(`entitlement:${feature}`);
  }
});

// CP3.6: Constants export all required values
const constantsPath = path.join(__dirname, '../src/lib/constants.ts');
if (fs.existsSync(constantsPath)) {
  const content = fs.readFileSync(constantsPath, 'utf8');
  ['COLOR_SEASONS', 'CULTURAL_CONTEXTS', 'TIERS', 'PRICING', 'AFFILIATE_PROGRAMMES', 'ANALYTICS_EVENTS']
    .forEach(key => {
      content.includes(key) ? pass(`constants:${key}`) : fail(`constants:${key}`);
    });
} else {
  fail('constants:file');
}

// CP3.7: Middleware protects required routes
const middlewarePath = path.join(__dirname, '../src/middleware.ts');
if (fs.existsSync(middlewarePath)) {
  const content = fs.readFileSync(middlewarePath, 'utf8');
  ['/wardrobe', '/advisor', '/api/wardrobe', '/api/advisor'].forEach(route => {
    content.includes(route) ? pass(`middleware:${route}`) : fail(`middleware:${route}`);
  });
} else {
  fail('middleware:file');
}

// CP3.8: Store has all required fields
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

// CP3.9: Build output has all routes
const buildOutput = path.join(__dirname, '../.next/server/app');
if (fs.existsSync(buildOutput)) {
  pass('build:output-exists');
} else {
  fail('build:output-exists');
}

console.log(`\nCP3 Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
