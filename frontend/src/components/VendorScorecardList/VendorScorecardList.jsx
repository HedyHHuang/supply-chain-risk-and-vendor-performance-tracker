import PropTypes from "prop-types";
import "./VendorScorecardList.css";

function VendorScorecardList({ scorecards, onEditScorecard, onDeleteScorecard }) {
    return (
        <section className="vendor-scorecard-list">
            <h2>Vendor Scorecards</h2>

            {scorecards.length === 0 ? (
                <p>No vendor scorecards available.</p>
            ) : (
                <ul>
                    {scorecards.map((scorecard) => (
                        <li key={scorecard.id}>
                            <strong>{scorecard.vendorName}</strong>
                            <br />
                            Delivery Score: {scorecard.deliveryScore}
                            <br />
                            Quality Score: {scorecard.qualityScore}
                            <br />
                            Communication Score: {scorecard.communicationScore}
                            <br />
                            Responsiveness Score: {scorecard.responsivenessScore}
                            <br />
                            Cost Score: {scorecard.costScore}
                            <br />
                            Overall Score: {scorecard.overallScore}
                            <br />
                            Performance Rating: {scorecard.performanceRating}
                            <br />
                            Comments: {scorecard.comments || "N/A"}
                            <br />
                            Corrective Action: {scorecard.correctiveAction || "N/A"}
                            <button
                                type="button"
                                onClick={() => onEditScorecard(scorecard)}
                            >
                                Edit
                            </button>
                            <br />
                            <button
                                type="button"
                                onClick={() => onDeleteScorecard(scorecard.id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

VendorScorecardList.propTypes = {
    scorecards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            vendorName: PropTypes.string.isRequired,
            deliveryScore: PropTypes.string.isRequired,
            qualityScore: PropTypes.string.isRequired,
            communicationScore: PropTypes.string.isRequired,
            responsivenessScore: PropTypes.string.isRequired,
            costScore: PropTypes.string.isRequired,
            overallScore: PropTypes.number.isRequired,
            performanceRating: PropTypes.string.isRequired,
            comments: PropTypes.string,
            correctiveAction: PropTypes.string,
            onDeleteScorecard: PropTypes.func.isRequired,
            onEditScorecard: PropTypes.func.isRequired,
        }),
    ).isRequired,
};

export default VendorScorecardList;