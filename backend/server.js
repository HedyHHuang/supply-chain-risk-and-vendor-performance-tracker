import express from "express";
import dotenv from "dotenv";
import session from "express-session";

import passport from "./auth/passportConfig.js";
import { connectToDatabase } from "./db/mongoConnection.js";

import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import scorecardRoutes from "./routes/scorecards.js";

dotenv.config();

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

app.get("/", (request, response) => {
    response.send(
        "Supply Chain Risk & Vendor Performance Tracker Backend Running",
    );
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/scorecards", scorecardRoutes);

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