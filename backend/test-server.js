const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.get('/test', (req, res) => {
  res.json({
    message: 'Basic routing is working',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    tasks: [
      { id: '1', title: 'Test Task 1', subject: 'CS', price: 10 },
      { id: '2', title: 'Test Task 2', subject: 'Math', price: 15 }
    ],
    total: 2
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('  GET /health');
  console.log('  GET /test');
  console.log('  GET /api/tasks');
});
