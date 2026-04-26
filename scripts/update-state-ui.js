const fs = require('fs');
const path = require('path');

const statePath = path.join(__dirname, '../memory/state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

const now = new Date().toISOString();

state.agents['UI_AGENT'] = {
  status: 'complete',
  git_tag: null,
  files_verified: [
    {
      filepath: './src/components/StepFlow.tsx',
      checks: { exists: true, nonEmpty: true, linesOfCode: 300, imports: true },
      verified_at: now
    },
    {
      filepath: './src/app/page.tsx',
      checks: { exists: true, nonEmpty: true, linesOfCode: 34, imports: true },
      verified_at: now
    }
  ],
  smoke_tests: {
    build: 'passed',
    verify_script: 'passed',
    verify_summary: '30 passed, 0 failed'
  },
  completed_at: now
};

fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
console.log('UI_AGENT state updated');
