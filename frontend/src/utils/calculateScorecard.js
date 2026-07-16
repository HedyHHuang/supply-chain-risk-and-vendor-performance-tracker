export function calculateScorecard(scorecard) {
    const scores = [
        scorecard.deliveryScore,
        scorecard.qualityScore,
        scorecard.communicationScore,
        scorecard.responsivenessScore,
        scorecard.costScore,
    ].map(Number);

    const hasInvalidScore = scores.some(
        (score) => Number.isNaN(score) || score < 0 || score > 100,
    );

    if (hasInvalidScore) {
        throw new Error("All scorecard scores must be numbers from 0 to 100.");
    }

    const totalScore = scores.reduce((total, score) => total + score, 0);
    const overallScore = totalScore / scores.length;

    let performanceRating;

    if (overallScore >= 90) {
        performanceRating = "Excellent";
    } else if (overallScore >= 80) {
        performanceRating = "Good";
    } else if (overallScore >= 70) {
        performanceRating = "Fair";
    } else {
        performanceRating = "Needs Improvement";
    }

    return {
        overallScore: Number(overallScore.toFixed(1)),
        performanceRating,
    };
}