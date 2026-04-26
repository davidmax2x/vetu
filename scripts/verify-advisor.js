const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
const fail = (msg) => { console.error('FAIL:', msg); failed++; };
const pass = (msg) => { console.log('PASS:', msg); passed++; };

// Check 1: engine.ts exists and exports functions
const enginePath = path.join(__dirname, '../src/lib/advisor/engine.ts');
if (fs.existsSync(enginePath)) {
  const content = fs.readFileSync(enginePath, 'utf8');
  (content.includes('getAdvisorResponse')) ? pass('advisor:getAdvisorResponse') : fail('advisor:getAdvisorResponse');
  (content.includes('buildAdvisorSystemPrompt')) ? pass('advisor:systemPrompt') : fail('advisor:systemPrompt');
  (content.includes('AdvisorContext')) ? pass('advisor:context-type') : fail('advisor:context-type');
} else {
  fail('advisor:engine-file');
}

// Check 2: API route exists
const apiPath = path.join(__dirname, '../src/app/api/advisor/route.ts');
if (fs.existsSync(apiPath)) {
  const content = fs.readFileSync(apiPath, 'utf8');
  (content.includes('getAdvisorResponse')) ? pass('api:advisor-response') : fail('api:advisor-response');
  (content.includes('ENTITLEMENT_DENIED')) ? pass('api:advisor-entitlement') : fail('api:advisor-entitlement');
  (content.includes('incrementUsage')) ? pass('api:advisor-usage') : fail('api:advisor-usage');
} else {
  fail('api:advisor-file');
}

// Check 3: Chat component exists
const chatPath = path.join(__dirname, '../src/components/advisor/Chat.tsx');
if (fs.existsSync(chatPath)) {
  const content = fs.readFileSync(chatPath, 'utf8');
  (content.includes('AdvisorChat')) ? pass('component:AdvisorChat') : fail('component:AdvisorChat');
  (content.includes('/api/advisor')) ? pass('component:api-call') : fail('component:api-call');
  (content.includes('loading')) ? pass('component:loading-state') : fail('component:loading-state');
} else {
  fail('component:AdvisorChat-file');
}

console.log(`\nADVISOR_AGENT Result: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
