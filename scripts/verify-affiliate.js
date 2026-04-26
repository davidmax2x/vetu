const fs = require('fs');
const path = require('path');
const { generateShoppingLinks, generateTrackedUrl } = require('../src/lib/affiliate/links');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// Check 1: generateShoppingLinks returns links
const links = generateShoppingLinks('blue dress');
(Array.isArray(links) && links.length > 0) ? pass('links:generate') : fail('links:generate');

// Check 2: each link has required fields
const valid = links.every(l => l.programme && l.url && l.commission);
valid ? pass('links:structure') : fail('links:structure');

// Check 3: URLs contain search query
const hasQuery = links.some(l => l.url.includes('blue+dress') || l.url.includes('blue%20dress'));
hasQuery ? pass('links:query-encoded') : fail('links:query-encoded');

// Check 4: generateTrackedUrl adds tracking params
const tracked = generateTrackedUrl('https://example.com/product', 'outfit-123', 'user-456');
(tracked.includes('vetu_ref=outfit-123') && tracked.includes('vetu_user=user-456'))
  ? pass('links:tracked')
  : fail('links:tracked');

// Check 5: API route exists
const apiPath = path.join(__dirname, '../src/app/api/affiliate/track/route.ts');
if (fs.existsSync(apiPath)) {
  const content = fs.readFileSync(apiPath, 'utf8');
  (content.includes('affiliate_clicks')) ? pass('api:track-table') : fail('api:track-table');
} else {
  fail('api:track-file');
}

console.log(`\nAFFILIATE_AGENT Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
