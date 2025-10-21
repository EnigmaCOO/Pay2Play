#!/usr/bin/env node

// Simple process supervisor to keep the server running
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting P2P Sports Platform...\n');

function startServer() {
  const server = spawn('npx', ['tsx', 'server/index.ts'], {
    cwd: path.join(__dirname),
    env: { ...process.env, NODE_ENV: 'development', PORT: '5000' },
    stdio: 'inherit'
  });

  server.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });

  server.on('exit', (code, signal) => {
    if (signal) {
      console.log(`\n⚠️  Server stopped by signal: ${signal}`);
    } else {
      console.log(`\n⚠️  Server exited with code: ${code}`);
    }
    
    // Only restart if not intentionally killed
    if (signal !== 'SIGINT' && signal !== 'SIGTERM') {
      console.log('🔄 Restarting in 2 seconds...\n');
      setTimeout(startServer, 2000);
    } else {
      process.exit(code || 0);
    }
  });

  // Forward signals to child process
  process.on('SIGINT', () => server.kill('SIGINT'));
  process.on('SIGTERM', () => server.kill('SIGTERM'));
}

startServer();
