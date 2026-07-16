const SCORECARDS_URL = "/api/scorecards";

export async function getScorecards() {
    const response = await fetch(SCORECARDS_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch scorecards.");
    }

    return response.json();
}

export async function createScorecard(scorecardData) {
    const response = await fetch(SCORECARDS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(scorecardData),
    });

    if (!response.ok) {
        throw new Error("Failed to create scorecard.");
    }

    return response.json();
}

export async function updateScorecard(scorecardData) {
    const response = await fetch(
        `${SCORECARDS_URL}/${scorecardData.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(scorecardData),
        },
    );

    if (!response.ok) {
        throw new Error("Failed to update scorecard.");
    }

    return response.json();
}

export async function deleteScorecard(scorecardId) {
    const response = await fetch(
        `${SCORECARDS_URL}/${scorecardId}`,
        {
            method: "DELETE",
        },
    );

    if (!response.ok) {
        throw new Error("Failed to delete scorecard.");
    }
}