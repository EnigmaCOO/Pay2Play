import AdmZip from 'adm-zip';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const zipPath = join(__dirname, 'attached_assets/p2p_replit_hotfix_overlay_1761046364997.zip');
const zip = new AdmZip(zipPath);

// Extract to a temp directory to avoid overwriting protected files
const tempDir = join(__dirname, 'hotfix_temp');
fs.mkdirSync(tempDir, { recursive: true });

console.log('📦 Extracting hotfix to temp directory...');
zip.extractAllTo(tempDir, true);

console.log('✅ Extracted to:', tempDir);
