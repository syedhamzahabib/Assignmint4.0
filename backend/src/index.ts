import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import Firebase configuration
import { initializeFirebaseAdmin, getFirestore, getAuth, getStorage } from './config/firebase';

// Import data source manager
import DataSourceManager from './data/DataSourceManager';

// Import middleware
import { errorHandler } from './utils/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

// Initialize Firebase Admin
let auth: any = null;
let db: any = null;
let storage: any = null;
let admin: any = null;

try {
  // Initialize Firebase Admin (will return null if MOCK_DATA=true)
  admin = initializeFirebaseAdmin();
  
  if (admin) {
    // Initialize Firebase services
    auth = getAuth();
    db = getFirestore();
    storage = getStorage();
    
    // Set Firestore instance in DataSourceManager
    const dataSourceManager = DataSourceManager.getInstance();
    dataSourceManager.setFirestoreInstance(db);
    
    logger.info('Firebase Admin initialized successfully');
  } else {
    logger.info('Using mock data, Firebase Admin not initialized');
  }
} catch (error) {
  logger.error('Firebase Admin initialization failed:', error);
  logger.warn('Switching to mock data mode');
  process.env['MOCK_DATA'] = 'true';
}

export { auth, db, storage, admin };

// CORS configuration for Expo and production
const corsOptions = {
  origin: [
    'http://localhost:8081', // Expo dev server
    'http://localhost:19006', // Expo web
    'http://127.0.0.1:19006', // Expo web alt
    'exp://127.0.0.1:*', // Expo dev
    'http://localhost', // iOS simulator WKWebView cases
    'https://expo.dev', // Expo production
    process.env['FRONTEND_URL'], // Custom frontend URL
  ].filter(Boolean) as string[],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'assignmint-backend',
    ts: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Test endpoint to verify basic routing
app.get('/test', (_req, res) => {
  res.json({
    message: 'Basic routing is working',
    timestamp: new Date().toISOString(),
  });
});

// API routes
import taskRoutes from './routes/taskRoutes.js';

app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, async () => {
  const env = process.env['NODE_ENV'] || 'development';
  const mockData = process.env['MOCK_DATA'] === 'true';
  const datasource = mockData ? 'Mock' : 'Firestore';
  const project = process.env['FIREBASE_PROJECT_ID'] || 'unknown';
  
  logger.info(`Backend running on port ${PORT} | env=${env} | mock=${mockData} | datasource=${datasource} | project=${project}`);
  
  try {
    // Initialize data source manager
    logger.info('Initializing data source manager...');
    const dataSourceManager = DataSourceManager.getInstance();
    
    // Test data source connection
    const isConnected = await dataSourceManager.testConnection();
    if (isConnected) {
      logger.info(`Data source connected successfully: ${dataSourceManager.getCurrentDataSourceType()}`);
    } else {
      logger.error('Data source connection failed');
    }
    
    logger.info('Server initialized successfully');
  } catch (error) {
    logger.error('Error initializing server:', error);
  }
});

export default app;
