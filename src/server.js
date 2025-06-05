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

const allowedOrigins = [
    'http://localhost:5173',
    'https://astro-travel-pgfk.vercel.app',
    'https://astro-travel-25fu8r94s-pgfk.vercel.app', // поточний білд
    'https://astro-travel.vercel.app' // основний домен
];

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
app.use('/routes/auth', authRoutes);

// Обробник 401 та 404
app.use((err, req, res, next) => {
    if (err.status === 401) {
        res.status(401).sendFile(path.join(__dirname, '..', 'public', '404.html'));
    } else {
        next(err);
    }
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html'));
});


// Start server
const PORT = process.env.PORT;
const ipAddress = process.env.DB_IP;

const server = http.createServer(app);

(async () => {
    await checkAndInitDatabase();
    server.listen(PORT, ipAddress, () => {
        console.log(`🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 `);
        console.log(`🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 `);
        // console.log(`🚀 AstroTravel Server is running on ${ipAddress}:${PORT}`);
        console.log(`🚀 AstroTravel Server is running on port:${PORT}`);
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
