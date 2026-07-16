const AUTH_URL = "/api/auth";

export async function registerUser(userData) {
    const response = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to register.");
    }

    return data;
}

export async function loginUser(credentials) {
    const response = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to log in.");
    }

    return data;
}

export async function logoutUser() {
    const response = await fetch(`${AUTH_URL}/logout`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to log out.");
    }
}

export async function getCurrentUser() {
    const response = await fetch(`${AUTH_URL}/current-user`);

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to check authentication.");
    }

    return response.json();
}