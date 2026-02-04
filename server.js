require('dotenv').config();
const app = require('./src/app');
const { initDB } = require('./src/models');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Initialize DB (Connect + Sync + Seed)
        await initDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
