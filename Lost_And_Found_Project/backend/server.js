const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const itemRoutes = require('./src/routes/itemRoutes');
const claimRoutes = require('./src/routes/claimRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for React Frontend (typically running on port 3000 or 5173)
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// REST API Routes
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: "UP",
    project: "CampusTrace Lost and Found Portal",
    backend: "Node.js & Express.js",
    frontend: "React.js",
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🎓 CampusTrace Backend (Node.js & Express.js)        `);
  console.log(` 🚀 Server running at: http://localhost:${PORT}        `);
  console.log(` 🩺 Health check:      http://localhost:${PORT}/api/health `);
  console.log(` 📦 Items API:         http://localhost:${PORT}/api/items `);
  console.log(` 🛡️ Claims API:        http://localhost:${PORT}/api/claims `);
  console.log(`=======================================================`);
});
