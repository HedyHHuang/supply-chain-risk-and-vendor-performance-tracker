import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import session from "express-session";

import passport from "./auth/passportConfig.js";
import { connectToDatabase } from "./db/mongoConnection.js";

import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import scorecardRoutes from "./routes/scorecards.js";

dotenv.config();
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/scorecards", scorecardRoutes);

const frontendDistPath = path.join(
    currentDirectory,
    "../frontend/dist",
);

app.use(express.static(frontendDistPath));

app.get("/{*splat}", (request, response) => {
    response.sendFile(
        path.join(frontendDistPath, "index.html"),
    );
});

async function startServer() {
    try {
        await connectToDatabase();

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exit(1);
    }
}

startServer();