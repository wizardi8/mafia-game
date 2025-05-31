require('dotenv').config();

const config = {
    port: process.env.PORT,
    store: {
        url: process.env.MONGO_URL,
        database: process.env.MONGO_DB,
        collections: {
            rooms: 'rooms',
            players: 'players',
        },
    },
};

module.exports = config;