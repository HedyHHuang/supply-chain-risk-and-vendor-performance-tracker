import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../db/mongoConnection.js";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const database = await connectToDatabase();
                const usersCollection = database.collection("users");

                const user = await usersCollection.findOne({
                    email: email.toLowerCase(),
                });

                if (!user) {
                    return done(null, false, {
                        message: "Incorrect email or password.",
                    });
                }

                const passwordMatches = await bcrypt.compare(
                    password,
                    user.passwordHash,
                );

                if (!passwordMatches) {
                    return done(null, false, {
                        message: "Incorrect email or password.",
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

passport.deserializeUser(async (userId, done) => {
    try {
        const database = await connectToDatabase();
        const usersCollection = database.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(userId),
        });

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

export default passport;