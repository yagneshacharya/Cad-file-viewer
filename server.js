const express = require('express');
const app = express();
const fileUploadRoutes = require('./src/routes/blocks.routes');
const cors = require('cors');
const { AppDataSource } = require('./src/data-source');

app.use(express.json());
app.use(cors({
  origin: '*', 
}));

// Register routes
app.use('/api', fileUploadRoutes);

app.get('/', (req, res) => {
  res.json('Backend is alive!');
});

// Initialize TypeORM and start server
AppDataSource.initialize()
  .then(() => {
    console.log('✅ TypeORM: Database connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running `);
    });
  })
  .catch((error) => {
    console.error('❌ TypeORM failed to connect:', error);
  });
