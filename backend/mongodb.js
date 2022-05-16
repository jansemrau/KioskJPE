const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const MongoClient = require("mongodb").MongoClient;

const mongoURL = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

let db;

const loadDB = async () => {
    if (db) {
        return db;
    }
    try {
        const client = await MongoClient.connect(mongoURL);
        db = client.db(process.env.DATABASENAME);
    } catch (err) {
        Raven.captureException(err);
    }
    return db;
};

module.exports = loadDB;
