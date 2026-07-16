import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;

if (!mongoUrl) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
}

if (!databaseName) {
    throw new Error(
        "MONGODB_DATABASE is not defined in the environment variables."
    );
}

const client = new MongoClient(mongoUrl);

let database;

export async function connectToDatabase() {
    if (!database) {
        await client.connect();
        database = client.db(databaseName);
        console.log(`Connected to MongoDB database: ${databaseName}`);
    }

    return database;
}