require('dotenv').config();
const app = require('./src/app');
const { initDB } = require('./src/models');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Initialize DB (Connect + Sync + Seed)
        await initDB();

        console.log("✅ Database connected successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        process.exit(1); // stop server if DB fails
    }
}

startServer();