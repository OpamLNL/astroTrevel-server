require('dotenv').config({ path: '../.env' });

const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const morgan = require('morgan');

const handleRequest = require('./routes/endpointRouter');
const authRoutes = require('./routes/auth');

const { closePool } = require('./config/database');
const { checkAndInitDatabase } = require('./migrations/db-checker');

// CORS
const allowedOrigins = ['http://localhost:5173'];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Serve images from public/images (from root)
const imagesPath = path.resolve(__dirname, '..', 'public', 'images');
app.use('/images', express.static(imagesPath));

// Middleware
app.use(express.json());

app.use(morgan('combined'));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use(handleRequest);


//authRoutes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT;
const ipAddress = process.env.DB_IP;

const server = http.createServer(app);

(async () => {
    await checkAndInitDatabase();
    server.listen(PORT, ipAddress, () => {
        console.log(`🚀 AstroTravel Server is running on ${ipAddress}:${PORT}`);
    });
})();

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await closePool();
        console.log('🔌 Відключено від БД');
        server.close(() => {
            console.log('🛑 Сервер зупинено');
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ Помилка при відключенні від БД', error);
        process.exit(1);
    }
});
