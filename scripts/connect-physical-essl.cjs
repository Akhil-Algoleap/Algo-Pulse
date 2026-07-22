/**
 * Physical eSSL Biometric Machine Real-Time Listener & Bridge
 * 
 * Usage:
 *   1. Check your eSSL machine IP address on LAN (e.g. 192.168.1.201)
 *   2. Run: node scripts/connect-physical-essl.cjs 192.168.1.201
 */

const http = require('http');

// Get IP from command line arguments or default to 192.168.1.201
const ESSL_IP = process.argv[2] || '192.168.1.201';
const ESSL_PORT = 4370;
const LOCAL_API_URL = 'http://localhost:5173/api/essl';

console.log('====================================================');
console.log('   eSSL Physical Biometric Machine Live Bridge');
console.log('====================================================');
console.log(` Target Machine IP   : ${ESSL_IP}:${ESSL_PORT}`);
console.log(` Destination Web API : ${LOCAL_API_URL}`);
console.log('----------------------------------------------------');

let ZKLib;
try {
  ZKLib = require('node-zklib');
} catch (e) {
  console.log('\n[INFO] Installing required "node-zklib" package for hardware TCP socket connection...\n');
  const { execSync } = require('child_process');
  execSync('npm install node-zklib axios --no-save', { stdio: 'inherit' });
  ZKLib = require('node-zklib');
}

async function postPunchToAlgoPulse(employeeId, timestamp) {
  const data = JSON.stringify({
    employee_id: employeeId,
    timestamp: timestamp || new Date().toISOString()
  });

  const req = http.request('http://localhost:5173/api/essl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        console.log(`\n[PUNCH SYNC SUCCESS] Employee ID: ${employeeId}`);
        console.log(` -> Action  : ${parsed.action === 'clock_in' ? 'CLOCK IN (First Swipe)' : 'CLOCK OUT (Second Swipe)'}`);
        console.log(` -> Message : ${parsed.message}`);
        console.log(` -> Details : Name=${parsed.data?.employee_name}, Status=${parsed.data?.status}, Hours=${parsed.data?.total_hours || 0}`);
      } catch (err) {
        console.log(`[PUNCH SYNC] Raw Response: ${body}`);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`[PUNCH SYNC ERROR] Could not reach Algo Pulse server at http://localhost:5173/api/essl - ${e.message}`);
  });

  req.write(data);
  req.end();
}

async function runBridge() {
  const zk = new ZKLib(ESSL_IP, ESSL_PORT, 10000, 4000);

  try {
    console.log(`[1/3] Connecting to eSSL machine at ${ESSL_IP}...`);
    await zk.createSocket();
    console.log('[2/3] Connected to physical eSSL device!');

    // Get basic information
    try {
      const serial = await zk.getSerialNumber();
      console.log(` -> Device Serial Number: ${serial || 'N/A'}`);
    } catch (e) {}

    console.log('[3/3] Listening for real-time card/fingerprint swipes on machine...');
    console.log('\n>>> SWIPE YOUR PHYSICAL ID CARD ON THE eSSL MACHINE NOW <<<\n');

    let lastLogCount = 0;

    // Register real-time event or poll every 2 seconds
    zk.getRealTimeLogs((err, data) => {
      if (err) {
        console.error('[REALTIME LOG ERROR]', err);
        return;
      }
      console.log(`\n⚡ [CARD SWIPE DETECTED ON HARDWARE!] User ID: ${data.userId || data.deviceUserId}`);
      postPunchToAlgoPulse(data.userId || data.deviceUserId, new Date().toISOString());
    });

    // Fallback polling loop every 3 seconds for new attendance logs
    setInterval(async () => {
      try {
        const logs = await zk.getLogs();
        const count = logs.data ? logs.data.length : 0;
        if (lastLogCount > 0 && count > lastLogCount) {
          const newLogs = logs.data.slice(lastLogCount);
          for (const l of newLogs) {
            console.log(`\n⚡ [NEW LOG DETECTED!] Card/User ID: ${l.deviceUserId}`);
            postPunchToAlgoPulse(l.deviceUserId, l.recordTime ? new Date(l.recordTime).toISOString() : new Date().toISOString());
          }
        }
        lastLogCount = count;
      } catch (pollErr) {
        // Suppress repetitive polling errors
      }
    }, 3000);

  } catch (err) {
    console.error('\n[CONNECTION ERROR] Could not connect to eSSL machine:', err.message);
    console.log('\nTroubleshooting Checklist:');
    console.log(` 1. Verify your eSSL machine is turned ON and connected to network.`);
    console.log(` 2. Ping the machine IP: ping ${ESSL_IP}`);
    console.log(` 3. Ensure your laptop and eSSL machine are on the SAME WiFi / LAN router.`);
    console.log(` 4. If your eSSL machine IP is different, run: node scripts/connect-physical-essl.cjs <YOUR_MACHINE_IP>`);
  }
}

runBridge();
