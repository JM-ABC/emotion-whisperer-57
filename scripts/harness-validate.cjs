const fs = require('fs');
const path = require('path');

function read(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

const root = path.resolve(__dirname, '..');
const report = [];

// 1) index.html viewport check
const indexHtml = read(path.join(root, 'index.html'));
if (!indexHtml) report.push(['index.html', false, 'missing']);
else {
  const hasViewport = /user-scalable=no/.test(indexHtml) && /maximum-scale=1.0/.test(indexHtml);
  report.push(['index.html.viewport', hasViewport, hasViewport ? 'ok' : 'missing user-scalable or maximum-scale']);
}

// 2) granite.config.ts presence and navigationBar
const granite = read(path.join(root, 'granite.config.ts'));
if (!granite) report.push(['granite.config.ts', false, 'missing']);
else {
  const back = /withBackButton\s*:\s*true/.test(granite);
  const home = /withHomeButton\s*:\s*true/.test(granite);
  report.push(['granite.navigationBar.withBackButton', back, back ? 'ok' : 'not true']);
  report.push(['granite.navigationBar.withHomeButton', home, home ? 'ok' : 'not true']);
}

// 3) app name consistency: check index.html and granite
if (indexHtml && granite) {
  const titleMatch = indexHtml.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  const brandMatch = granite.match(/displayName\s*:\s*'([^']+)'/);
  const brand = brandMatch ? brandMatch[1] : null;
  const same = title && brand && title.indexOf(brand) !== -1;
  report.push(['branding.title_matches_granite', same, same ? `ok (${brand})` : `mismatch: title='${title}' granite='${brand}'`]);
}

// 4) forbidden APIs
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name) || /\.ts$/.test(e.name) || /\.jsx?$/.test(e.name)) {
      const content = read(p) || '';
      if (/\balert\s*\(/.test(content) || /\bconfirm\s*\(/.test(content)) {
        report.push([p, false, 'contains alert/confirm']);
      }
    }
  }
}
if (fs.existsSync(path.join(root, 'src'))) walk(path.join(root, 'src'));

// 5) server token exchange existence
const exchange = read(path.join(root, 'supabase', 'functions', 'exchange-token', 'index.ts'));
report.push(['supabase/functions/exchange-token', !!exchange, exchange ? 'ok' : 'missing']);

// print report
let failed = 0;
console.log('harness-validate report:');
for (const [k, ok, msg] of report) {
  console.log(`- ${k}: ${ok ? 'PASS' : 'FAIL'} — ${msg}`);
  if (!ok) failed++;
}
process.exit(failed > 0 ? 2 : 0);
