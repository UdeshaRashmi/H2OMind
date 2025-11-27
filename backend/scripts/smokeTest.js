const http = require('http');

const app = require('../src/app');
const { ensureStore } = require('../src/store');

async function run() {
  await ensureStore();

  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, resolve);
  });

  const { port } = server.address();
  const baseUrl = `http://localhost:${port}/api`;
  const email = `test+${Date.now()}@example.com`;
  const password = 'secret123';

  try {
    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Tester',
        email,
        password,
        dailyGoal: 2200,
      }),
    });

    if (!registerResponse.ok) {
      throw new Error(`Register failed: ${registerResponse.status}`);
    }

    const { user } = await registerResponse.json();

    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const usageResponse = await fetch(`${baseUrl}/usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        date: new Date().toISOString().split('T')[0],
        liters: 750,
        category: 'drinking',
        notes: 'Smoke test entry',
      }),
    });

    if (!usageResponse.ok) {
      throw new Error(`Usage create failed: ${usageResponse.status}`);
    }

    const summaryResponse = await fetch(`${baseUrl}/insights/summary?userId=${user.id}`);
    if (!summaryResponse.ok) {
      throw new Error(`Summary failed: ${summaryResponse.status}`);
    }

    const summary = await summaryResponse.json();

    console.log('Smoke test completed. Totals:', summary.totals);
  } finally {
    server.close();
  }
}

run().catch((error) => {
  console.error('Smoke test failed:', error);
  process.exit(1);
});

