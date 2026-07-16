export function calculateRisk(order) {
    const orderedQuantity = Number(order.orderedQuantity);
    const receivedQuantity =
        order.receivedQuantity === "" ? orderedQuantity : Number(order.receivedQuantity);

    const hasQualityIssue = order.issueType === "Quality Issue";
    const hasShortage = receivedQuantity < orderedQuantity;

    let daysLate = 0;

    if (order.actualDeliveryDate && order.expectedDeliveryDate) {
        const expectedDate = new Date(order.expectedDeliveryDate);
        const actualDate = new Date(order.actualDeliveryDate);

        daysLate = Math.ceil(
            (actualDate - expectedDate) / (1000 * 60 * 60 * 24),
        );
    }

    if (
        hasQualityIssue ||
        daysLate > 7 ||
        receivedQuantity < orderedQuantity * 0.8
    ) {
        return "High";
    }

    if (daysLate > 0 || hasShortage) {
        return "Medium";
    }

    if (order.issueType !== "None") {
        return "Low";
    }

    return "None";
}