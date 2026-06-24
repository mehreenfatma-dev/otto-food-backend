require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const reservationRoutes = require('./routes/reservations');
const feedbackRoutes = require('./routes/feedback');
const userRoutes = require('./routes/users');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ========== API ROUTES ==========

// Home route
app.get('/', (req, res) => {
  res.json({
    message: "🍔 OTTO FOODS ON WHEELS API",
    status: "Running",
    version: "2.0.0",
    database: "MongoDB Atlas",
    endpoints: {
      menu: [
        "GET    /api/menu - Get all menu items",
        "POST   /api/menu - Create menu item",
        "PUT    /api/menu/:id - Update menu item",
        "DELETE /api/menu/:id - Delete menu item"
      ],
      orders: [
        "GET    /api/orders - Get all orders",
        "GET    /api/orders/:id - Get single order",
        "POST   /api/orders - Create order",
        "PATCH  /api/orders/:id/status - Update order status",
        "DELETE /api/orders/:id - Cancel order"
      ],
      reservations: [
        "GET    /api/reservations - Get all reservations",
        "GET    /api/reservations/:id - Get single reservation",
        "POST   /api/reservations - Create reservation",
        "DELETE /api/reservations/:id - Cancel reservation"
      ],
      feedback: [
        "GET    /api/feedback - Get all feedback",
        "GET    /api/feedback/stats - Get feedback statistics",
        "POST   /api/feedback - Submit feedback"
      ],
      users: [
        "POST   /api/users/register - Register new user",
        "POST   /api/users/login - Login user"
      ]
    }
  });
});

// Mount routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  🍔 OTTO FOODS ON WHEELS - BACKEND API');
  console.log('═══════════════════════════════════════════');
  console.log(`📍 Server:    http://localhost:${PORT}`);
  console.log(`🗄️  Database:  MongoDB Atlas`);
  console.log(`📋 Routes:    15 endpoints ready`);
  console.log(`🔒 Auth:      JWT enabled`);
  console.log('═══════════════════════════════════════════');
  console.log('');
});