import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distServerPath = path.join(__dirname, 'dist', 'server.cjs');
const isRunningWithTsx = process.argv.some((arg) => arg.includes('tsx')) || Boolean(process.env.TSX_TS);

if (fs.existsSync(distServerPath) && !isRunningWithTsx) {
  // Production runtime (Cloud Run container rollout, npm start, node server.ts)
  const require = createRequire(import.meta.url);
  require(distServerPath);
} else {
  // Development runtime (tsx server.ts)
  await import('./server/serverApp.ts');
}
