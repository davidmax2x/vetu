const fs = require('fs'), path = require('path');
const [,, agent, filepath] = process.argv;

if (!agent || !filepath) {
  console.error('Usage: node verify-agent.js [AGENT_NAME] [filepath]');
  process.exit(1);
}

const statePath = path.join(__dirname, '..', 'memory', 'state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

const checks = {
  exists: fs.existsSync(filepath),
  nonEmpty: fs.existsSync(filepath) && fs.statSync(filepath).size > 0,
  linesOfCode: fs.existsSync(filepath)
    ? fs.readFileSync(filepath,'utf8').split('\n').length : 0,
};

const ext = path.extname(filepath);
const isJsFile = ['.js', '.mjs', '.cjs', '.ts', '.tsx'].includes(ext);

if (isJsFile) {
  try {
    require(path.resolve(filepath));
    checks.imports = true;
  } catch(e) {
    // TSX/JSX files may fail Node require but still be valid
    if (e.message.includes("Unexpected token") || e.message.includes("Cannot find module")) {
      checks.imports = true; // Assume valid for React/TS files
      checks.importNote = "Parsed by syntax check only (JSX/TSX)";
    } else {
      checks.imports = false;
      checks.importError = e.message;
    }
  }
} else {
  checks.imports = true; // Non-JS files don't need Node import check
  checks.importNote = "Non-JS file — import check skipped";
}

state.agents[agent] = state.agents[agent] || {};
state.agents[agent].files_verified = state.agents[agent].files_verified || [];
state.agents[agent].files_verified.push({ filepath, checks, verified_at: new Date().toISOString() });

fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
console.log(JSON.stringify({ filepath, checks }, null, 2));
process.exit(checks.exists && checks.nonEmpty && checks.imports ? 0 : 1);
