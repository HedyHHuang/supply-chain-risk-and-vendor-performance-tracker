import { useState } from "react";
import PropTypes from "prop-types";
import "./VendorScorecardForm.css";

const emptyFormData = {
    vendorName: "",
    deliveryScore: "",
    qualityScore: "",
    communicationScore: "",
    responsivenessScore: "",
    costScore: "",
    comments: "",
    correctiveAction: "",
};

function VendorScorecardForm({
    editingScorecard,
    onAddScorecard,
    onUpdateScorecard,
    onCancelEdit,
}) {
    const [formData, setFormData] = useState(
        editingScorecard ?? emptyFormData,
    );

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (editingScorecard) {
            onUpdateScorecard(formData);
        } else {
            onAddScorecard(formData);
        }

        setFormData(emptyFormData);
    }

    function handleCancel() {
        setFormData(emptyFormData);
        onCancelEdit();
    }

    return (
        <form className="vendor-scorecard-form" onSubmit={handleSubmit}>
            <h2>{editingScorecard ? "Edit Vendor Scorecard" : "Add Vendor Scorecard"}</h2>

            <label htmlFor="scorecardVendorName">Vendor Name</label>
            <input
                id="scorecardVendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                required
            />

            <label htmlFor="deliveryScore">Delivery Score</label>
            <input
                id="deliveryScore"
                name="deliveryScore"
                type="number"
                min="0"
                max="100"
                value={formData.deliveryScore}
                onChange={handleChange}
                required
            />

            <label htmlFor="qualityScore">Quality Score</label>
            <input
                id="qualityScore"
                name="qualityScore"
                type="number"
                min="0"
                max="100"
                value={formData.qualityScore}
                onChange={handleChange}
                required
            />

            <label htmlFor="communicationScore">Communication Score</label>
            <input
                id="communicationScore"
                name="communicationScore"
                type="number"
                min="0"
                max="100"
                value={formData.communicationScore}
                onChange={handleChange}
                required
            />

            <label htmlFor="responsivenessScore">Responsiveness Score</label>
            <input
                id="responsivenessScore"
                name="responsivenessScore"
                type="number"
                min="0"
                max="100"
                value={formData.responsivenessScore}
                onChange={handleChange}
                required
            />

            <label htmlFor="costScore">Cost Score</label>
            <input
                id="costScore"
                name="costScore"
                type="number"
                min="0"
                max="100"
                value={formData.costScore}
                onChange={handleChange}
                required
            />

            <label htmlFor="comments">Comments</label>
            <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
            />

            <label htmlFor="scorecardCorrectiveAction">Corrective Action</label>
            <textarea
                id="scorecardCorrectiveAction"
                name="correctiveAction"
                value={formData.correctiveAction}
                onChange={handleChange}
            />

            <button type="submit">
                {editingScorecard ? "Update Scorecard" : "Add Scorecard"}
            </button>

            {editingScorecard && (
                <button type="button" onClick={handleCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
}

VendorScorecardForm.propTypes = {
    editingScorecard: PropTypes.shape({
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
    }),
    onAddScorecard: PropTypes.func.isRequired,
    onUpdateScorecard: PropTypes.func.isRequired,
    onCancelEdit: PropTypes.func.isRequired,
};

VendorScorecardForm.defaultProps = {
    editingScorecard: null,
};

export default VendorScorecardForm;