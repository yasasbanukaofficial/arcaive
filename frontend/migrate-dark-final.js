const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  // Backgrounds with brackets
  { regex: /bg-\[#FAF9F6\]/g, replacement: 'bg-[var(--bg-color)]' },
  { regex: /bg-\[#F5F4EF\]/g, replacement: 'bg-[var(--glass-border)]' },
  { regex: /bg-white/g, replacement: 'bg-[var(--glass-bg)]' },
  { regex: /bg-beige/g, replacement: 'bg-[var(--bg-color)]' },
  
  // Borders with brackets
  { regex: /border-black\/(?:5|10|20|\[0\.[0-9]+\]|03|05|80)/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /border-\[#E8E6DE\]/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /border-black/g, replacement: 'border-[var(--glass-border)]' },
  { regex: /focus:border-black/g, replacement: 'focus:border-[var(--text-primary)]' },
  { regex: /group-hover:border-black/g, replacement: 'group-hover:border-[var(--text-primary)]' },
  
  // Text with brackets or slashes
  { regex: /text-black\/[0-9]+/g, replacement: 'text-[var(--text-secondary)]' },
  { regex: /text-black/g, replacement: 'text-[var(--text-primary)]' },
  { regex: /text-\[#888880\]/g, replacement: 'text-[var(--text-secondary)]' },
  
  // Hovers
  { regex: /hover:bg-\[#F5F4EF\]/g, replacement: 'hover:bg-[var(--glass-border)]' },
  { regex: /hover:bg-\[#FAF9F6\]/g, replacement: 'hover:bg-[var(--glass-border)]' },
  { regex: /hover:bg-white/g, replacement: 'hover:bg-[var(--glass-border)]' },
  { regex: /hover:text-black/g, replacement: 'hover:text-[var(--text-primary)]' },
  { regex: /group-hover:bg-black/g, replacement: 'group-hover:bg-[var(--text-primary)]' },
  { regex: /group-hover:text-white/g, replacement: 'group-hover:text-[var(--bg-color)]' },
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

console.log('Final migration complete.');
