import AdmZip from 'adm-zip';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const zipPath = join(__dirname, 'attached_assets/p2p_replit_hotfix_overlay_1761046364997.zip');
const zip = new AdmZip(zipPath);

console.log('📦 Contents of hotfix overlay:');
console.log('');

zip.getEntries().forEach(entry => {
  if (!entry.isDirectory) {
    console.log(`  ${entry.entryName} (${entry.header.size} bytes)`);
  }
});
