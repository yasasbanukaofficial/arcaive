const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  // Backgrounds
  { regex: /\bbg-white\b/g, replacement: 'bg-[var(--glass-bg)]' },
  { regex: /\bbg-\[#FAF9F6\]\b/g, replacement: 'bg-[var(--bg-color)]' },
  { regex: /\bbg-\[#F5F4EF\]\b/g, replacement: 'bg-[var(--glass-border)]' },
  { regex: /\bbg-beige\b/g, replacement: 'bg-[var(--bg-color)]' },
  
  // Borders
  { regex: /\bborder-black\/(?:5|10|20|\[0\.[0-9]+\]|03|05|80)\b/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /\bborder-\[#E8E6DE\]\b/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /\bborder-black\b/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /\bfocus:border-black\b/g, replacement: 'focus:border-[var(--text-primary)]' },
  { regex: /\bgroup-hover:border-black\b/g, replacement: 'group-hover:border-[var(--text-primary)]' },
  
  // Text
  { regex: /\btext-black\/[0-9]+\b/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /\btext-black\b/g, replacement: 'text-[var(--text-primary)]' },
  { regex: /\btext-\[#888880\]\b/g, replacement: 'text-[var(--text-secondary)]' },
  
  // Hovers
  { regex: /\bhover:bg-\[#F5F4EF\]\b/g, replacement: 'hover:bg-[var(--glass-border)]' },
  { regex: /\bhover:bg-[#FAF9F6]\b/g, replacement: 'hover:bg-[var(--glass-border)]' },
  { regex: /\bhover:bg-white\b/g, replacement: 'hover:bg-[var(--glass-border)]' },
  { regex: /\bhover:text-black\b/g, replacement: 'hover:text-[var(--text-primary)]' },
  { regex: /\bgroup-hover:bg-black\b/g, replacement: 'group-hover:bg-[var(--text-primary)]' },
  { regex: /\bgroup-hover:text-white\b/g, replacement: 'group-hover:text-[var(--bg-color)]' },
];

function processDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
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

['src/features', 'src/components', 'src/app'].forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) processDir(fullPath);
});

console.log('Aggressive migration complete.');
