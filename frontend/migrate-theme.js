const fs = require('fs');
const path = require('path');

const DIRS_TO_PROCESS = [
  'dashboard',
  'jobs',
  'cv-analysis',
  'interview',
  'settings',
  'billing'
];

const REPLACEMENTS = [
  { regex: /\bbg-white\b/g, replacement: 'bg-[var(--glass-bg)]' },
  { regex: /\bbg-\[#FAF9F6\]\b/g, replacement: 'bg-[var(--bg-color)]' },
  { regex: /\bbg-\[#F5F4EF\]\b/g, replacement: 'bg-[var(--glass-border)]' },
  { regex: /\bborder-black\/(?:5|10|20|\[0\.[0-9]+\])\b/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /\bborder-\[#E8E6DE\]\b/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /\btext-black\/[0-9]+\b/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /\btext-black\b/g, replacement: 'text-[var(--text-primary)]' },
  { regex: /\btext-\[#888880\]\b/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /\bbg-black\/(?:5|10|20|\[0\.[0-9]+\])\b/g, replacement: 'bg-[var(--glass-border)]' },
  { regex: /\bbg-beige\b/g, replacement: 'bg-[var(--bg-color)]' },
];

function processDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { regex, replacement } of REPLACEMENTS) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

for (const dir of DIRS_TO_PROCESS) {
  const srcPath = path.join(__dirname, 'src/features', dir);
  if (fs.existsSync(srcPath)) {
    processDir(srcPath);
  }
}

// Also process some app router files if needed
const appDashPath = path.join(__dirname, 'src/app/(dashboard)');
if (fs.existsSync(appDashPath)) processDir(appDashPath);

console.log('Migration complete.');
