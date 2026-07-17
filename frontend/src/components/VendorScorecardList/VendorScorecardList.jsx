import PropTypes from "prop-types";
import "./VendorScorecardList.css";

function VendorScorecardList({
    scorecards,
    onEditScorecard,
    onDeleteScorecard,
}) {
    return (
        <section className="scorecard-list">
            <div className="list-heading">
                <div>
                    <p className="section-eyebrow">Supplier Evaluation</p>
                    <h2>Vendor Scorecards</h2>
                </div>

                <span>{scorecards.length} shown</span>
            </div>

            {scorecards.length === 0 ? (
                <p className="empty-message">No scorecards available.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Delivery</th>
                                <th>Quality</th>
                                <th>Communication</th>
                                <th>Responsiveness</th>
                                <th>Cost</th>
                                <th>Overall</th>
                                <th>Rating</th>
                                <th>Comments</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {scorecards.map((scorecard) => (
                                <tr key={scorecard.id}>
                                    <td>
                                        <strong>{scorecard.vendorName}</strong>
                                    </td>

                                    <td>{scorecard.deliveryScore}</td>
                                    <td>{scorecard.qualityScore}</td>
                                    <td>{scorecard.communicationScore}</td>
                                    <td>{scorecard.responsivenessScore}</td>
                                    <td>{scorecard.costScore}</td>

                                    <td>
                                        <strong>{scorecard.overallScore}</strong>
                                    </td>

                                    <td>
                                        <span
                                            className={`badge rating-${scorecard.performanceRating
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`}
                                        >
                                            {scorecard.performanceRating}
                                        </span>
                                    </td>

                                    <td>{scorecard.comments || "-"}</td>

                                    <td>
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                onClick={() => onEditScorecard(scorecard)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() =>
                                                    onDeleteScorecard(scorecard.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

VendorScorecardList.propTypes = {
    scorecards: PropTypes.array.isRequired,
    onEditScorecard: PropTypes.func.isRequired,
    onDeleteScorecard: PropTypes.func.isRequired,
};

export default VendorScorecardList;