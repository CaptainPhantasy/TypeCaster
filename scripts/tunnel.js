#!/usr/bin/env node

/**
 * TypeCasting Ngrok Tunnel Manager
 * 
 * Programmatically manages ngrok tunnels for the TypeCasting app
 * Usage: node scripts/tunnel.js [start|stop|status]
 */

import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TUNNEL_INFO_FILE = path.join(__dirname, '../.tunnel-info.json');
const NGROK_PORT = 5177;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function getTunnelInfo() {
  try {
    const response = await fetch('http://localhost:4040/api/tunnels');
    const data = await response.json();
    return data.tunnels.find(tunnel => tunnel.config.addr.includes(NGROK_PORT.toString()));
  } catch (error) {
    return null;
  }
}

async function startTunnel() {
  log('blue', '🎭 Starting TypeCasting Ngrok Tunnel...');
  
  // Check if tunnel is already running
  const existingTunnel = await getTunnelInfo();
  if (existingTunnel) {
    log('yellow', `⚠️  Tunnel already running: ${existingTunnel.public_url}`);
    saveTunnelInfo(existingTunnel);
    return;
  }
  
  // Start ngrok tunnel
  const ngrokProcess = spawn('ngrok', ['http', NGROK_PORT.toString(), '--host-header=localhost:5177'], {
    stdio: 'pipe',
    detached: true
  });
  
  ngrokProcess.unref();
  
  // Wait for tunnel to establish
  setTimeout(async () => {
    const tunnel = await getTunnelInfo();
    if (tunnel) {
      log('green', `✅ Tunnel established: ${tunnel.public_url}`);
      log('blue', `📱 Share with teammates: ${tunnel.public_url}`);
      saveTunnelInfo(tunnel);
      
      // Generate shareable info
      generateShareableInfo(tunnel.public_url);
    } else {
      log('red', '❌ Failed to establish tunnel');
    }
  }, 3000);
}

async function stopTunnel() {
  log('yellow', '🛑 Stopping TypeCasting tunnel...');
  
  exec('pkill -f "ngrok http"', (error) => {
    if (error) {
      log('red', '❌ Error stopping tunnel');
    } else {
      log('green', '✅ Tunnel stopped');
      deleteTunnelInfo();
    }
  });
}

async function showStatus() {
  const tunnel = await getTunnelInfo();
  
  if (tunnel) {
    log('green', '✅ TypeCasting Tunnel Status: ACTIVE');
    log('blue', `🌐 Public URL: ${tunnel.public_url}`);
    log('blue', `🏠 Local URL: http://localhost:${NGROK_PORT}`);
    log('blue', `📊 Connections: ${tunnel.metrics.conns.count}`);
    
    // Show shareable info
    showShareableInfo(tunnel.public_url);
  } else {
    log('red', '❌ TypeCasting Tunnel Status: INACTIVE');
    log('yellow', '💡 Run "node scripts/tunnel.js start" to create tunnel');
  }
}

function saveTunnelInfo(tunnel) {
  const info = {
    url: tunnel.public_url,
    started: new Date().toISOString(),
    port: NGROK_PORT
  };
  fs.writeFileSync(TUNNEL_INFO_FILE, JSON.stringify(info, null, 2));
}

function deleteTunnelInfo() {
  if (fs.existsSync(TUNNEL_INFO_FILE)) {
    fs.unlinkSync(TUNNEL_INFO_FILE);
  }
}

function generateShareableInfo(url) {
  const shareInfo = `
🎭 TypeCasting - Theatrical Typing Tutor

🌐 Live Demo: ${url}
🎯 What it is: Gamified touch typing with theatrical flair
🎨 Features: Progressive keyboard fading, mistake tracking, celebration effects

🎮 How to use:
1. Click through any browser security warnings
2. Choose a scene from the Casting Call
3. Start typing the script exactly as shown
4. Watch your keyboard fade as you improve!

🛠️ Built with: React 19, Vite, Tailwind CSS v4
⚡ Status: Live development server

Happy typing! 🎭✨
`;

  fs.writeFileSync(path.join(__dirname, '../SHARE.md'), shareInfo);
  log('green', '📄 Shareable info saved to SHARE.md');
}

function showShareableInfo(url) {
  console.log(`
${colors.bold}${colors.blue}🎭 TypeCasting Live Demo${colors.reset}
${colors.green}🌐 ${url}${colors.reset}

${colors.yellow}📱 Share with teammates:${colors.reset}
"Check out TypeCasting at ${url} - click through any security warnings to test the theatrical typing tutor!"

${colors.blue}💡 Pro tip: Bookmark this URL for easy sharing!${colors.reset}
`);
}

// CLI Interface
const command = process.argv[2] || 'status';

switch (command) {
  case 'start':
    startTunnel();
    break;
  case 'stop':
    stopTunnel();
    break;
  case 'status':
    showStatus();
    break;
  default:
    log('yellow', '📖 Usage: node scripts/tunnel.js [start|stop|status]');
    log('blue', '   start  - Create new tunnel');
    log('blue', '   stop   - Stop active tunnel');
    log('blue', '   status - Show tunnel status');
}
