const { estimateTryOnCost, checkSessionBudget } = require('../src/lib/replicate');
const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// Check 1: estimateTryOnCost returns positive number
const cost = estimateTryOnCost();
(typeof cost === 'number' && cost > 0 && cost < 0.80) ? pass(`cost:estimate=${cost}`) : fail(`cost:estimate=${cost}`);

// Check 2: checkSessionBudget allows when under budget
const under = checkSessionBudget(0);
(under.allowed && under.remaining > 0) ? pass('budget:under') : fail('budget:under');

// Check 3: checkSessionBudget denies when over budget
const over = checkSessionBudget(0.80);
(!over.allowed && over.remaining <= 0) ? pass('budget:over') : fail('budget:over');

// Check 4: replicate.ts exists and exports functions
const replicatePath = path.join(__dirname, '../src/lib/replicate.ts');
if (fs.existsSync(replicatePath)) {
  const content = fs.readFileSync(replicatePath, 'utf8');
  (content.includes('export async function generateGarmentImage')) ? pass('replicate:generateGarmentImage') : fail('replicate:generateGarmentImage');
  (content.includes('export async function runIdmVton')) ? pass('replicate:runIdmVton') : fail('replicate:runIdmVton');
  (content.includes('export async function prewarmModel')) ? pass('replicate:prewarmModel') : fail('replicate:prewarmModel');
  (content.includes('export function estimateTryOnCost')) ? pass('replicate:estimateTryOnCost') : fail('replicate:estimateTryOnCost');
  (content.includes('export function checkSessionBudget')) ? pass('replicate:checkSessionBudget') : fail('replicate:checkSessionBudget');
} else {
  fail('replicate:file-exists');
}

// Check 5: API route exists
const apiPath = path.join(__dirname, '../src/app/api/tryon/route.ts');
if (fs.existsSync(apiPath)) {
  const content = fs.readFileSync(apiPath, 'utf8');
  (content.includes('[TRYON]')) ? pass('api:tryon-exists') : fail('api:tryon-exists');
  (content.includes('generateGarmentImage')) ? pass('api:stage1') : fail('api:stage1');
  (content.includes('runIdmVton')) ? pass('api:stage2') : fail('api:stage2');
  (content.includes('ENTITLEMENT_DENIED')) ? pass('api:entitlement') : fail('api:entitlement');
  (content.includes('BUDGET_EXCEEDED')) ? pass('api:budget') : fail('api:budget');
} else {
  fail('api:tryon-file');
}

// Check 6: TryOnModal component exists
const modalPath = path.join(__dirname, '../src/components/TryOnModal.tsx');
if (fs.existsSync(modalPath)) {
  const content = fs.readFileSync(modalPath, 'utf8');
  (content.includes('TryOnModal')) ? pass('component:TryOnModal') : fail('component:TryOnModal');
  (content.includes('stage1')) ? pass('modal:stage1-state') : fail('modal:stage1-state');
  (content.includes('stage2')) ? pass('modal:stage2-state') : fail('modal:stage2-state');
  (content.includes('complete')) ? pass('modal:complete-state') : fail('modal:complete-state');
} else {
  fail('component:TryOnModal-file');
}

console.log(`\nTRYON_AGENT Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
