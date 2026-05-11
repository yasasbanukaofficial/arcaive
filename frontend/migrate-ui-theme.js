const fs = require('fs');
const path = require('path');

const DIR_TO_PROCESS = 'src/components/ui';

const REPLACEMENTS = [
  { regex: /\bbg-white\b/g, replacement: 'bg-[var(--glass-bg)]' },
  { regex: /\bbg-\[#FAF9F6\]\b/g, replacement: 'bg-[var(--bg-color)]' },
  { regex: /\bbg-\[#F5F4EF\]\b/g, replacement: 'bg-[var(--glass-border)]' },
  { regex: /\bborder-black\/(?:5|10|20|\[0\.[0-9]+\])\b/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /\bborder-\[#E8E6DE\]\b/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /\bborder-black\b/g, replacement: 'border-[var(--text-primary)]' },
  { regex: /\bfocus:border-black\b/g, replacement: 'focus:border-[var(--text-primary)]' },
  { regex: /\btext-black\/[0-9]+\b/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /\btext-black\b/g, replacement: 'text-[var(--text-primary)]' },
  { regex: /\btext-\[#888880\]\b/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /\bbg-black\/(?:5|10|20|\[0\.[0-9]+\])\b/g, replacement: 'bg-[var(--glass-border)]' },
  { regex: /\bbg-beige\b/g, replacement: 'bg-[var(--bg-color)]' },
  { regex: /\bhover:bg-\[#F5F4EF\]\b/g, replacement: 'hover:bg-[var(--glass-border)]' },
  { regex: /\bhover:bg-[#FAF9F6]\b/g, replacement: 'hover:bg-[var(--glass-border)]' },
  { regex: /\bhover:text-black\b/g, replacement: 'hover:text-[var(--text-primary)]' },
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

const srcPath = path.join(__dirname, DIR_TO_PROCESS);
if (fs.existsSync(srcPath)) {
  processDir(srcPath);
}

console.log('UI Migration complete.');
