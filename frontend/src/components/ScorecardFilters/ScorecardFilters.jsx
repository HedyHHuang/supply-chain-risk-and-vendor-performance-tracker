import PropTypes from "prop-types";
import "./ScorecardFilters.css";

function ScorecardFilters({ filters, onFilterChange }) {
    function handleChange(event) {
        const { name, value } = event.target;

        onFilterChange({
            ...filters,
            [name]: value,
        });
    }

    return (
        <section className="scorecard-filters">
            <h2>Filter Scorecards</h2>

            <label htmlFor="scorecardVendorFilter">Vendor</label>
            <input
                id="scorecardVendorFilter"
                name="vendorName"
                value={filters.vendorName}
                onChange={handleChange}
                placeholder="Search vendor"
            />

            <label htmlFor="ratingFilter">Performance Rating</label>
            <select
                id="ratingFilter"
                name="performanceRating"
                value={filters.performanceRating}
                onChange={handleChange}
            >
                <option value="">All</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Improvement">Needs Improvement</option>
            </select>
        </section>
    );
}

ScorecardFilters.propTypes = {
    filters: PropTypes.shape({
        vendorName: PropTypes.string.isRequired,
        performanceRating: PropTypes.string.isRequired,
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

export default ScorecardFilters;