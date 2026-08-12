// ============================================================
// server.js - Main Entry Point for EventOps Backend
// ============================================================
// This is the starting file for our Express server.
// It sets up:
//   1. Express app with middleware (CORS, JSON parsing)
//   2. Connects to MongoDB database
//   3. Registers all API routes
//   4. Starts the reminder scheduler
//   5. Starts the server on PORT 5000
// ============================================================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { startReminderScheduler } from './services/reminderService.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// --- Import all route files ---
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import speakerRoutes from './routes/speakerRoutes.js';
import sponsorshipRoutes from './routes/sponsorshipRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import intelligenceRoutes from './routes/intelligenceRoutes.js';

// Create Express app
const app = express();

// ---- Middleware ----
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost, the exact CLIENT_URL, or any Vercel preview URL
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Reject everything else
    return callback(new Error('Blocked by CORS policy'), false);
  },
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ---- Connect to MongoDB ----
connectDB();

// ---- Register API Routes ----
// Each route file handles a specific part of the API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/registrations', registrationRoutes);
app.use('/api/v1/venues', venueRoutes);
app.use('/api/v1/speakers', speakerRoutes);
app.use('/api/v1/sponsorships', sponsorshipRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/assistant', assistantRoutes);
app.use('/api/v1/intelligence', intelligenceRoutes);

// JSON 404 for any unmatched /api/v1/... route
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// ---- Global Error Handler ----
app.use(errorHandler);

// ---- Start Reminder Scheduler ----
startReminderScheduler();

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ EventOps Server running on http://localhost:${PORT}`);
});