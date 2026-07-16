import express from "express";
import { connectToDatabase } from "../db/mongoConnection.js";

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const ordersCollection = database.collection("orders");

        const orders = await ordersCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        response.json(orders);
    } catch (error) {
        console.error("Failed to retrieve orders:", error);

        response.status(500).json({
            message: "Failed to retrieve orders.",
        });
    }
});

router.get("/:id", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const ordersCollection = database.collection("orders");

        const order = await ordersCollection.findOne({
            id: request.params.id,
        });

        if (!order) {
            return response.status(404).json({
                message: "Order not found.",
            });
        }

        return response.json(order);
    } catch (error) {
        console.error("Failed to retrieve order:", error);

        return response.status(500).json({
            message: "Failed to retrieve order.",
        });
    }
});

router.post("/", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const ordersCollection = database.collection("orders");

        const newOrder = {
            ...request.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const existingOrder = await ordersCollection.findOne({
            id: newOrder.id,
        });

        if (existingOrder) {
            return response.status(409).json({
                message: "An order with this ID already exists.",
            });
        }

        await ordersCollection.insertOne(newOrder);

        return response.status(201).json(newOrder);
    } catch (error) {
        console.error("Failed to create order:", error);

        return response.status(500).json({
            message: "Failed to create order.",
        });
    }
});

router.put("/:id", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const ordersCollection = database.collection("orders");

        const updatedOrder = {
            ...request.body,
            id: request.params.id,
            updatedAt: new Date(),
        };

        delete updatedOrder._id;
        delete updatedOrder.createdAt;

        const result = await ordersCollection.findOneAndUpdate(
            {
                id: request.params.id,
            },
            {
                $set: updatedOrder,
            },
            {
                returnDocument: "after",
            },
        );

        if (!result) {
            return response.status(404).json({
                message: "Order not found.",
            });
        }

        return response.json(result);
    } catch (error) {
        console.error("Failed to update order:", error);

        return response.status(500).json({
            message: "Failed to update order.",
        });
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const database = await connectToDatabase();
        const ordersCollection = database.collection("orders");

        const result = await ordersCollection.deleteOne({
            id: request.params.id,
        });

        if (result.deletedCount === 0) {
            return response.status(404).json({
                message: "Order not found.",
            });
        }

        return response.status(204).send();
    } catch (error) {
        console.error("Failed to delete order:", error);

        return response.status(500).json({
            message: "Failed to delete order.",
        });
    }
});

export default router;