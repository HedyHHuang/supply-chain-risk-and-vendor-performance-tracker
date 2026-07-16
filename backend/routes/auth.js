import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { connectToDatabase } from "../db/mongoConnection.js";

const router = express.Router();

router.post("/register", async (request, response) => {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Name, email, and password are required.",
            });
        }

        const database = await connectToDatabase();
        const usersCollection = database.collection("users");

        const normalizedEmail = email.toLowerCase();

        const existingUser = await usersCollection.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return response.status(409).json({
                message: "An account with this email already exists.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            email: normalizedEmail,
            passwordHash,
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        return response.status(201).json({
            id: result.insertedId.toString(),
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        console.error("Failed to register user:", error);

        return response.status(500).json({
            message: "Failed to register user.",
        });
    }
});

router.post("/login", (request, response, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error) {
            return next(error);
        }

        if (!user) {
            return response.status(401).json({
                message: info?.message || "Login failed.",
            });
        }

        return request.logIn(user, (loginError) => {
            if (loginError) {
                return next(loginError);
            }

            return response.json({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            });
        });
    })(request, response, next);
});

router.post("/logout", (request, response, next) => {
    request.logout((error) => {
        if (error) {
            return next(error);
        }

        request.session.destroy(() => {
            response.status(204).send();
        });
    });
});

router.get("/current-user", (request, response) => {
    if (!request.isAuthenticated()) {
        return response.status(401).json({
            message: "Not authenticated.",
        });
    }

    return response.json({
        id: request.user._id.toString(),
        name: request.user.name,
        email: request.user.email,
    });
});

export default router;