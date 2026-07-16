import express from "express";
import { connectToDatabase } from "../db/mongoConnection.js";

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const scorecardsCollection = database.collection("scorecards");

        const scorecards = await scorecardsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        response.json(scorecards);
    } catch (error) {
        console.error("Failed to retrieve scorecards:", error);

        response.status(500).json({
            message: "Failed to retrieve scorecards.",
        });
    }
});

router.get("/:id", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const scorecardsCollection = database.collection("scorecards");

        const scorecard = await scorecardsCollection.findOne({
            id: request.params.id,
        });

        if (!scorecard) {
            return response.status(404).json({
                message: "Scorecard not found.",
            });
        }

        return response.json(scorecard);
    } catch (error) {
        console.error("Failed to retrieve scorecard:", error);

        return response.status(500).json({
            message: "Failed to retrieve scorecard.",
        });
    }
});

router.post("/", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const scorecardsCollection = database.collection("scorecards");

        const newScorecard = {
            ...request.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const existingScorecard = await scorecardsCollection.findOne({
            id: newScorecard.id,
        });

        if (existingScorecard) {
            return response.status(409).json({
                message: "A scorecard with this ID already exists.",
            });
        }

        await scorecardsCollection.insertOne(newScorecard);

        return response.status(201).json(newScorecard);
    } catch (error) {
        console.error("Failed to create scorecard:", error);

        return response.status(500).json({
            message: "Failed to create scorecard.",
        });
    }
});

router.put("/:id", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const scorecardsCollection = database.collection("scorecards");

        const updatedScorecard = {
            ...request.body,
            id: request.params.id,
            updatedAt: new Date(),
        };

        delete updatedScorecard._id;
        delete updatedScorecard.createdAt;

        const result = await scorecardsCollection.findOneAndUpdate(
            {
                id: request.params.id,
            },
            {
                $set: updatedScorecard,
            },
            {
                returnDocument: "after",
            },
        );

        if (!result) {
            return response.status(404).json({
                message: "Scorecard not found.",
            });
        }

        return response.json(result);
    } catch (error) {
        console.error("Failed to update scorecard:", error);

        return response.status(500).json({
            message: "Failed to update scorecard.",
        });
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const scorecardsCollection = database.collection("scorecards");

        const result = await scorecardsCollection.deleteOne({
            id: request.params.id,
        });

        if (result.deletedCount === 0) {
            return response.status(404).json({
                message: "Scorecard not found.",
            });
        }

        return response.status(204).send();
    } catch (error) {
        console.error("Failed to delete scorecard:", error);

        return response.status(500).json({
            message: "Failed to delete scorecard.",
        });
    }
});

export default router;