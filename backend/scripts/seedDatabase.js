import dotenv from "dotenv";
import { connectToDatabase } from "../db/mongoConnection.js";

dotenv.config();

const vendors = [
    "Pacific Food Supply",
    "Golden Produce",
    "Bay Area Packaging",
    "West Coast Logistics",
    "Fresh Source Distribution",
    "Prime Ingredient Solutions",
    "NorthStar Imports",
    "Evergreen Manufacturing",
];

const items = [
    "Frozen Mango Chunks",
    "Strawberry Puree",
    "Coconut Milk",
    "Packaging Cups",
    "Paper Straws",
    "Tea Leaves",
    "Fruit Syrup",
    "Sealing Film",
];

const issueTypes = [
    "None",
    "Late Delivery",
    "Quantity Shortage",
    "Quality Issue",
];

const statuses = ["Open", "In Progress", "Resolved"];

function randomItem(itemsArray) {
    return itemsArray[Math.floor(Math.random() * itemsArray.length)];
}

function randomNumber(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function createRandomDate(startDate, endDate) {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    return new Date(
        startTime + Math.random() * (endTime - startTime),
    );
}

function calculateRiskLevel({
    orderedQuantity,
    receivedQuantity,
    issueType,
    expectedDeliveryDate,
    actualDeliveryDate,
}) {
    const expectedDate = new Date(expectedDeliveryDate);
    const actualDate = new Date(actualDeliveryDate);

    const daysLate = Math.ceil(
        (actualDate - expectedDate) / (1000 * 60 * 60 * 24),
    );

    if (
        issueType === "Quality Issue" ||
        daysLate > 7 ||
        receivedQuantity < orderedQuantity * 0.8
    ) {
        return "High";
    }

    if (
        daysLate > 0 ||
        receivedQuantity < orderedQuantity
    ) {
        return "Medium";
    }

    if (issueType !== "None") {
        return "Low";
    }

    return "None";
}

function calculatePerformanceRating(overallScore) {
    if (overallScore >= 90) {
        return "Excellent";
    }

    if (overallScore >= 80) {
        return "Good";
    }

    if (overallScore >= 70) {
        return "Fair";
    }

    return "Needs Improvement";
}

async function seedDatabase() {
    try {
        const database = await connectToDatabase();

        const ordersCollection = database.collection("orders");
        const scorecardsCollection = database.collection("scorecards");

        await ordersCollection.deleteMany({});
        await scorecardsCollection.deleteMany({});

        const orders = Array.from({ length: 1000 }, (_, index) => {
            const orderedQuantity = randomNumber(50, 1000);
            const receivedQuantity = randomNumber(
                Math.floor(orderedQuantity * 0.6),
                orderedQuantity,
            );

            const expectedDeliveryDate = createRandomDate(
                new Date("2026-01-01"),
                new Date("2026-12-01"),
            );

            const actualDeliveryDate = new Date(expectedDeliveryDate);
            actualDeliveryDate.setDate(
                actualDeliveryDate.getDate() + randomNumber(-3, 14),
            );

            const issueType = randomItem(issueTypes);

            const order = {
                id: crypto.randomUUID(),
                poNumber: `PO-${String(index + 1).padStart(5, "0")}`,
                vendorName: randomItem(vendors),
                itemName: randomItem(items),
                expectedDeliveryDate: expectedDeliveryDate
                    .toISOString()
                    .slice(0, 10),
                actualDeliveryDate: actualDeliveryDate
                    .toISOString()
                    .slice(0, 10),
                orderedQuantity: String(orderedQuantity),
                receivedQuantity: String(receivedQuantity),
                issueType,
                correctiveAction:
                    issueType === "None"
                        ? ""
                        : "Supplier follow-up and corrective action review required.",
                status: randomItem(statuses),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            return {
                ...order,
                riskLevel: calculateRiskLevel(order),
            };
        });

        const scorecards = Array.from({ length: 200 }, () => {
            const deliveryScore = randomNumber(50, 100);
            const qualityScore = randomNumber(50, 100);
            const communicationScore = randomNumber(50, 100);
            const responsivenessScore = randomNumber(50, 100);
            const costScore = randomNumber(50, 100);

            const overallScore = Number(
                (
                    (deliveryScore +
                        qualityScore +
                        communicationScore +
                        responsivenessScore +
                        costScore) /
                    5
                ).toFixed(1),
            );

            return {
                id: crypto.randomUUID(),
                vendorName: randomItem(vendors),
                deliveryScore: String(deliveryScore),
                qualityScore: String(qualityScore),
                communicationScore: String(communicationScore),
                responsivenessScore: String(responsivenessScore),
                costScore: String(costScore),
                overallScore,
                performanceRating:
                    calculatePerformanceRating(overallScore),
                comments: "Synthetic vendor performance record.",
                correctiveAction:
                    overallScore < 70
                        ? "Performance improvement plan required."
                        : "",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        });

        await ordersCollection.insertMany(orders);
        await scorecardsCollection.insertMany(scorecards);

        console.log(`Inserted ${orders.length} orders.`);
        console.log(`Inserted ${scorecards.length} scorecards.`);

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed database:", error);
        process.exit(1);
    }
}

seedDatabase();