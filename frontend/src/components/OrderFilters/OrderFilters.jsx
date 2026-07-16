import PropTypes from "prop-types";
import "./OrderFilters.css";

function OrderFilters({ filters, onFilterChange }) {
    function handleChange(event) {
        const { name, value } = event.target;

        onFilterChange({
            ...filters,
            [name]: value,
        });
    }

    return (
        <section className="order-filters">
            <h2>Filter Orders</h2>

            <label htmlFor="vendorFilter">Vendor</label>
            <input
                id="vendorFilter"
                name="vendorName"
                value={filters.vendorName}
                onChange={handleChange}
                placeholder="Search vendor"
            />

            <label htmlFor="riskFilter">Risk Level</label>
            <select
                id="riskFilter"
                name="riskLevel"
                value={filters.riskLevel}
                onChange={handleChange}
            >
                <option value="">All</option>
                <option value="None">None</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            <label htmlFor="statusFilter">Status</label>
            <select
                id="statusFilter"
                name="status"
                value={filters.status}
                onChange={handleChange}
            >
                <option value="">All</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
            </select>
        </section>
    );
}

OrderFilters.propTypes = {
    filters: PropTypes.shape({
        vendorName: PropTypes.string.isRequired,
        riskLevel: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

export default OrderFilters;