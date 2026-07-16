const ORDERS_URL = "/api/orders";

export async function getOrders() {
    const response = await fetch(ORDERS_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch orders.");
    }

    return response.json();
}

export async function createOrder(orderData) {
    const response = await fetch(ORDERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        throw new Error("Failed to create order.");
    }

    return response.json();
}

export async function updateOrder(orderData) {
    const response = await fetch(`${ORDERS_URL}/${orderData.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        throw new Error("Failed to update order.");
    }

    return response.json();
}

export async function deleteOrder(orderId) {
    const response = await fetch(`${ORDERS_URL}/${orderId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete order.");
    }
}