/* eslint-disable */
const { MongoClient } = require('mongodb');
const config = require('../../server/src/config');

class MongoDB {
    client;
    database;
    collections = [];

    runCfg = [];

    constructor() {
        if (!MongoDB._instance) {
            MongoDB._instance = this;
            return this.getDB()
                .then(() => MongoDB._instance)
                .catch(() => false);
        }
        return MongoDB._instance;
    }

    static readRunConfig() {
        return config;
    }

    async getDB() {
        return new Promise(async (resolve, reject) => {
            try {
                if (!process.env.MONGO_URL) {
                    this.runCfg = MongoDB.readRunConfig();
                    process.env.MONGO_URL = this.runCfg.store.url;
                    process.env.MONGO_DB = this.runCfg.store.database;
                }
                MongoClient.connect(process.env.MONGO_URL, null,
                    async (error, client) => {
                        try {
                            if (error) {
                                console.log(error);
                                reject();
                                return;
                            }
                            this.client = client;
                            this.database = await client.db(process.env.MONGO_DB);
                            this.runCfg = MongoDB.readRunConfig();

                            for (const collection in this.runCfg.store.collections) {
                                if (this.runCfg.store.collections.hasOwnProperty(collection)) {
                                    const collectionNameInDB = this.runCfg.store.collections[collection];
                                    this.collections[collection] = await this.database.collection(collectionNameInDB);
                                }
                            }
                            resolve();
                        } catch (e) {
                            console.log(e);
                            reject();
                        }
                    });
            } catch (e) {
                console.log(e);
                reject();
            }

        });
    }

    static getInstance() {
        return this._instance;
    }

    static disconnect() {
        if (MongoDB._instance && MongoDB._instance.client) {
            MongoDB._instance.client.close();
            MongoDB._instance = null;
            console.log('Mongo disconnect');
        }
    }
}

module.exports = {
    MongoDB,
};
