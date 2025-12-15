const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:3000';
let testsPassed = 0;
let testsFailed = 0;

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function test(name, fn) {
  try {
    await fn();
    testsPassed++;
    console.log(`✓ ${name}`);
  } catch (error) {
    testsFailed++;
    console.error(`✗ ${name}`);
    console.error(`  Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('Running backend tests...\n');

  // Test 1: Health check endpoint
  await test('Health check endpoint returns 200', async () => {
    const response = await makeRequest('GET', '/health');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (response.body.status !== 'ok') {
      throw new Error(`Expected status 'ok', got '${response.body.status}'`);
    }
  });

  // Test 2: GET /api/messages returns empty array initially
  await test('GET /api/messages returns empty array initially', async () => {
    const response = await makeRequest('GET', '/api/messages');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!Array.isArray(response.body)) {
      throw new Error(`Expected array, got ${typeof response.body}`);
    }
  });

  // Test 3: POST /api/messages with valid data
  await test('POST /api/messages creates a message', async () => {
    const messageData = {
      author: 'Test User',
      content: 'Test message content'
    };
    const response = await makeRequest('POST', '/api/messages', messageData);
    if (response.status !== 201) {
      throw new Error(`Expected status 201, got ${response.status}`);
    }
    if (!response.body.id) {
      throw new Error('Message should have an id');
    }
    if (response.body.author !== messageData.author) {
      throw new Error(`Expected author '${messageData.author}', got '${response.body.author}'`);
    }
    if (response.body.content !== messageData.content) {
      throw new Error(`Expected content '${messageData.content}', got '${response.body.content}'`);
    }
    if (!response.body.timestamp) {
      throw new Error('Message should have a timestamp');
    }
  });

  // Test 4: POST /api/messages without author should fail
  await test('POST /api/messages without author returns 400', async () => {
    const response = await makeRequest('POST', '/api/messages', { content: 'Test' });
    if (response.status !== 400) {
      throw new Error(`Expected status 400, got ${response.status}`);
    }
    if (!response.body.error) {
      throw new Error('Expected error message in response');
    }
  });

  // Test 5: POST /api/messages without content should fail
  await test('POST /api/messages without content returns 400', async () => {
    const response = await makeRequest('POST', '/api/messages', { author: 'Test' });
    if (response.status !== 400) {
      throw new Error(`Expected status 400, got ${response.status}`);
    }
    if (!response.body.error) {
      throw new Error('Expected error message in response');
    }
  });

  // Test 6: GET /api/messages returns posted messages
  await test('GET /api/messages returns posted messages', async () => {
    // Post a message first
    const messageData = {
      author: 'Test User 2',
      content: 'Another test message'
    };
    await makeRequest('POST', '/api/messages', messageData);

    // Get all messages
    const response = await makeRequest('GET', '/api/messages');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!Array.isArray(response.body)) {
      throw new Error(`Expected array, got ${typeof response.body}`);
    }
    if (response.body.length === 0) {
      throw new Error('Expected at least one message in the array');
    }
    const lastMessage = response.body[response.body.length - 1];
    if (lastMessage.author !== messageData.author || lastMessage.content !== messageData.content) {
      throw new Error('Last message does not match posted message');
    }
  });

  console.log(`\nTests completed: ${testsPassed} passed, ${testsFailed} failed`);

  if (testsFailed > 0) {
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});

