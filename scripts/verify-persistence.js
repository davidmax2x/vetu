const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// Check 1: db/client.ts exists and exports getSupabaseAdmin
const clientPath = path.join(__dirname, '../src/lib/db/client.ts');
if (fs.existsSync(clientPath)) {
  const content = fs.readFileSync(clientPath, 'utf8');
  (content.includes('export function getSupabaseAdmin')) ? pass('db:client') : fail('db:client');
} else {
  fail('db:client-file');
}

// Check 2: wardrobe.ts exists and exports required functions
const wardrobePath = path.join(__dirname, '../src/lib/db/wardrobe.ts');
if (fs.existsSync(wardrobePath)) {
  const content = fs.readFileSync(wardrobePath, 'utf8');
  (content.includes('export async function saveOutfit')) ? pass('wardrobe:saveOutfit') : fail('wardrobe:saveOutfit');
  (content.includes('export async function getSavedOutfits')) ? pass('wardrobe:getSavedOutfits') : fail('wardrobe:getSavedOutfits');
  (content.includes('export async function deleteSavedOutfit')) ? pass('wardrobe:deleteSavedOutfit') : fail('wardrobe:deleteSavedOutfit');
  (content.includes('export async function getSavedOutfitById')) ? pass('wardrobe:getSavedOutfitById') : fail('wardrobe:getSavedOutfitById');
} else {
  fail('wardrobe:file');
}

// Check 3: feedback.ts exists and exports required functions
const feedbackPath = path.join(__dirname, '../src/lib/db/feedback.ts');
if (fs.existsSync(feedbackPath)) {
  const content = fs.readFileSync(feedbackPath, 'utf8');
  (content.includes('export async function submitFeedback')) ? pass('feedback:submitFeedback') : fail('feedback:submitFeedback');
  (content.includes('export async function getFeedbackForOutfit')) ? pass('feedback:getFeedbackForOutfit') : fail('feedback:getFeedbackForOutfit');
  (content.includes('export async function getUserFeedback')) ? pass('feedback:getUserFeedback') : fail('feedback:getUserFeedback');
} else {
  fail('feedback:file');
}

// Check 4: wardrobe API route exists
const wardrobeApiPath = path.join(__dirname, '../src/app/api/wardrobe/route.ts');
if (fs.existsSync(wardrobeApiPath)) {
  const content = fs.readFileSync(wardrobeApiPath, 'utf8');
  (content.includes('export async function POST')) ? pass('api:wardrobe-post') : fail('api:wardrobe-post');
  (content.includes('export async function GET')) ? pass('api:wardrobe-get') : fail('api:wardrobe-get');
  (content.includes('export async function DELETE')) ? pass('api:wardrobe-delete') : fail('api:wardrobe-delete');
  (content.includes('ENTITLEMENT_DENIED')) ? pass('api:wardrobe-entitlement') : fail('api:wardrobe-entitlement');
} else {
  fail('api:wardrobe-file');
}

// Check 5: feedback API route exists
const feedbackApiPath = path.join(__dirname, '../src/app/api/feedback/route.ts');
if (fs.existsSync(feedbackApiPath)) {
  const content = fs.readFileSync(feedbackApiPath, 'utf8');
  (content.includes('export async function POST')) ? pass('api:feedback-post') : fail('api:feedback-post');
  (content.includes('export async function GET')) ? pass('api:feedback-get') : fail('api:feedback-get');
  (content.includes("'like'") && content.includes("'dislike'")) ? pass('api:feedback-types') : fail('api:feedback-types');
} else {
  fail('api:feedback-file');
}

// Check 6: schema.sql exists and has required tables
const schemaPath = path.join(__dirname, '../src/lib/db/schema.sql');
if (fs.existsSync(schemaPath)) {
  const content = fs.readFileSync(schemaPath, 'utf8');
  (content.includes('saved_outfits')) ? pass('schema:saved_outfits') : fail('schema:saved_outfits');
  (content.includes('feedback')) ? pass('schema:feedback') : fail('schema:feedback');
  (content.includes('users')) ? pass('schema:users') : fail('schema:users');
  (content.includes('entitlements')) ? pass('schema:entitlements') : fail('schema:entitlements');
} else {
  fail('schema:file');
}

console.log(`\nPERSISTENCE_AGENT Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
