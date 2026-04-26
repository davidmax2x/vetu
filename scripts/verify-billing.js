const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// Check 1: stripe.ts exists and exports functions
const stripePath = path.join(__dirname, '../src/lib/billing/stripe.ts');
if (fs.existsSync(stripePath)) {
  const content = fs.readFileSync(stripePath, 'utf8');
  (content.includes('createCheckoutSession')) ? pass('stripe:createCheckoutSession') : fail('stripe:createCheckoutSession');
  (content.includes('createPortalSession')) ? pass('stripe:createPortalSession') : fail('stripe:createPortalSession');
  (content.includes('getOrCreateCustomer')) ? pass('stripe:getOrCreateCustomer') : fail('stripe:getOrCreateCustomer');
  (content.includes('getSubscriptionTier')) ? pass('stripe:getSubscriptionTier') : fail('stripe:getSubscriptionTier');
  (content.includes('getStripeClient')) ? pass('stripe:lazy-init') : fail('stripe:lazy-init');
} else {
  fail('stripe:file');
}

// Check 2: entitlements.ts exists and exports functions
const entPath = path.join(__dirname, '../src/lib/billing/entitlements.ts');
if (fs.existsSync(entPath)) {
  const content = fs.readFileSync(entPath, 'utf8');
  (content.includes('export async function checkEntitlement')) ? pass('entitlements:checkEntitlement') : fail('entitlements:checkEntitlement');
  (content.includes('export async function incrementUsage')) ? pass('entitlements:incrementUsage') : fail('entitlements:incrementUsage');
  (content.includes('export async function setUserTier')) ? pass('entitlements:setUserTier') : fail('entitlements:setUserTier');
  (content.includes('analyse')) ? pass('entitlements:analyse-feature') : fail('entitlements:analyse-feature');
  (content.includes('tryon')) ? pass('entitlements:tryon-feature') : fail('entitlements:tryon-feature');
  (content.includes('advisor')) ? pass('entitlements:advisor-feature') : fail('entitlements:advisor-feature');
} else {
  fail('entitlements:file');
}

// Check 3: billing API routes exist
const subscribeRoute = path.join(__dirname, '../src/app/api/billing/subscribe/route.ts');
const portalRoute = path.join(__dirname, '../src/app/api/billing/portal/route.ts');
const webhookRoute = path.join(__dirname, '../src/app/api/billing/webhook/route.ts');

if (fs.existsSync(subscribeRoute)) {
  const content = fs.readFileSync(subscribeRoute, 'utf8');
  (content.includes('createCheckoutSession')) ? pass('api:subscribe') : fail('api:subscribe');
} else {
  fail('api:subscribe-file');
}

if (fs.existsSync(portalRoute)) {
  const content = fs.readFileSync(portalRoute, 'utf8');
  (content.includes('createPortalSession')) ? pass('api:portal') : fail('api:portal');
} else {
  fail('api:portal-file');
}

if (fs.existsSync(webhookRoute)) {
  const content = fs.readFileSync(webhookRoute, 'utf8');
  (content.includes('checkout.session.completed')) ? pass('api:webhook-checkout') : fail('api:webhook-checkout');
  (content.includes('customer.subscription.deleted')) ? pass('api:webhook-subscription') : fail('api:webhook-subscription');
  (content.includes('setUserTier')) ? pass('api:webhook-setTier') : fail('api:webhook-setTier');
} else {
  fail('api:webhook-file');
}

// Check 4: UpgradeModal exists
const modalPath = path.join(__dirname, '../src/components/billing/UpgradeModal.tsx');
if (fs.existsSync(modalPath)) {
  const content = fs.readFileSync(modalPath, 'utf8');
  (content.includes('UpgradeModal')) ? pass('component:UpgradeModal') : fail('component:UpgradeModal');
  (content.includes('/api/billing/subscribe')) ? pass('component:subscribe-api') : fail('component:subscribe-api');
} else {
  fail('component:UpgradeModal-file');
}

// Check 5: schema.sql has usage and entitlements tables
const schemaPath = path.join(__dirname, '../src/lib/db/schema.sql');
if (fs.existsSync(schemaPath)) {
  const content = fs.readFileSync(schemaPath, 'utf8');
  (content.includes('usage')) ? pass('schema:usage') : fail('schema:usage');
  (content.includes('increment_usage')) ? pass('schema:increment-rpc') : fail('schema:increment-rpc');
} else {
  fail('schema:file');
}

console.log(`\nBILLING_AGENT Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
