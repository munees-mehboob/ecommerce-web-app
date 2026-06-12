const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
require('./models/index');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
   origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/api', (req, res) => {
  res.json({ message: 'API is running ✅' });
});

const startServer = async () => {
  try {
    // 1. Connect to the database
    await connectDB();
    
    // 2. Sync models (REMOVED { alter: true } to stop the MySQL Key error)
    await sequelize.sync()
    console.log('✅ Database models synced');

    // 3. Start the server (Only one listen call here)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start logic
startServer();

// Error handlers at the very bottom
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});
