import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { prisma } from './lib/prisma';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import requestRoutes from './routes/requests';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Restrict CORS to allow requests from our frontend domain, localhost, and Vercel subdomains
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://moonlightcurtains.vercel.app',
  'https://www.moonlightcurtains.co.ke',
  'https://moonlightcurtains.co.ke'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Dynamically allow Vercel previews and localhost on any port
    if (origin.endsWith('.vercel.app') || /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Rate limiting — prevent spam on public form submission routes
const publicPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 requests per IP per window
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts. Please try again later.' },
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/requests', publicPostLimiter, requestRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const dbUrlSet = !!process.env.DATABASE_URL;
    const jwtSecretSet = !!process.env.NEXTAUTH_SECRET;
    
    let dbStatus = 'not_tested';
    let dbError = null;

    if (dbUrlSet) {
      try {
        // Query the database to ensure connection is working
        await prisma.user.findFirst();
        dbStatus = 'connected';
      } catch (err: any) {
        dbStatus = 'connection_failed';
        dbError = err.message || String(err);
      }
    } else {
      dbStatus = 'missing_database_url';
    }

    const allOk = dbStatus === 'connected' && jwtSecretSet;

    res.status(allOk ? 200 : 500).json({
      status: allOk ? 'ok' : 'error',
      message: allOk ? 'Moonlight Curtains API is fully operational' : 'Moonlight Curtains API has configuration errors',
      timestamp: new Date().toISOString(),
      env: {
        DATABASE_URL_configured: dbUrlSet,
        NEXTAUTH_SECRET_configured: jwtSecretSet,
        NODE_ENV: process.env.NODE_ENV || 'development'
      },
      database: {
        status: dbStatus,
        error: dbError
      }
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: 'Unexpected health check failure',
      error: err.message || String(err)
    });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
