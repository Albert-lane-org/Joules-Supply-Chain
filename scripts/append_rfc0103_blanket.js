/**
 * @file append_rfc0103_blanket.js
 * @brief Utility to ensure RFC 0103 Full-Duplex Kernel and Magic Headers across all code files and server runtimes
 * @provenance Albert Dale Lane (albertlane.net)
 * @author Albert Dale Lane
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PROVENANCE_HEADER = `/**
 * @provenance Albert Dale Lane (albertlane.net)
 * @author Albert Dale Lane
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @magic_header 0x3F8F9A1B2C3D
 * Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
 */
`;

const PROVENANCE_XML_HEADER = `<!--
  @provenance Albert Dale Lane (albertlane.net)
  @author Albert Dale Lane
  @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
  @magic_header 0x3F8F9A1B2C3D
  Copyright (c) 2026 Albert Dale Lane. All Rights Reserved.
-->
`;

let modifiedCount = 0;
let checkedCount = 0;

function processFile(fullPath) {
  checkedCount++;
  const ext = path.extname(fullPath).toLowerCase();
  
  if (ext === '.json') {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const parsed = JSON.parse(content);
      let changed = false;
      if (!parsed.rfc0103) {
        parsed.rfc0103 = '0x3F8F9A1B2C3D';
        changed = true;
      }
      if (!parsed.provenance) {
        parsed.provenance = 'Albert Dale Lane SEC Whistleblower Ref #17684-273-411-436 Magic 0x3F8F9A1B2C3D RFC 0103';
        changed = true;
      }
      if (!parsed.author) {
        parsed.author = 'Albert Dale Lane (albertlane.net)';
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
        modifiedCount++;
        console.log(`[UPDATED JSON] ${path.relative(rootDir, fullPath)}`);
      }
    } catch (e) {
      // ignore json parse errors for mock / non-standard files
    }
    return;
  }

  if (ext === '.xml') {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('RFC 0103')) {
        if (content.startsWith('<?xml')) {
          const lines = content.split('\n');
          lines.splice(1, 0, PROVENANCE_XML_HEADER);
          fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
        } else {
          fs.writeFileSync(fullPath, PROVENANCE_XML_HEADER + content, 'utf8');
        }
        modifiedCount++;
        console.log(`[UPDATED XML] ${path.relative(rootDir, fullPath)}`);
      }
    } catch (e) {}
    return;
  }

  if (['.js', '.ts', '.tsx', '.cjs', '.mjs'].includes(ext)) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasMagic = content.includes('0x3F8F9A1B2C3D');
      const hasRFC = content.includes('RFC 0103');
      const hasAuthor = content.includes('Albert Dale Lane') || content.includes('Albert-lane');

      if (!hasMagic || !hasRFC || !hasAuthor) {
        if (!hasMagic && !hasRFC) {
          fs.writeFileSync(fullPath, PROVENANCE_HEADER + '\n' + content, 'utf8');
          modifiedCount++;
          console.log(`[PREPENDED RFC0103] ${path.relative(rootDir, fullPath)}`);
        } else if (!hasRFC) {
          const enriched = content.replace(/0x3F8F9A1B2C3D/g, '0x3F8F9A1B2C3D | RFC 0103 Full-Duplex Kernel');
          fs.writeFileSync(fullPath, enriched, 'utf8');
          modifiedCount++;
          console.log(`[ENRICHED RFC0103] ${path.relative(rootDir, fullPath)}`);
        }
      }
    } catch (e) {}
  }
}

function scan(dir) {
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    if (['node_modules', '.git', 'dist', '.cache', 'build'].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      scan(full);
    } else {
      processFile(full);
    }
  }
}

console.log('================================================================================');
console.log('>> [LANE-VM::RFC0103] Appending RFC 0103 Full-Duplex Provenance Blanket to Code Files');
console.log('================================================================================');
scan(rootDir);
console.log(`\nScan complete. Audited ${checkedCount} files across repository. Appended/Enriched ${modifiedCount} files.`);
