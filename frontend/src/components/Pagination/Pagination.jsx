import PropTypes from "prop-types";
import "./Pagination.css";

function Pagination({
    currentPage,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
}) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    return (
        <div className="pagination">
            <label htmlFor="pageSize">Rows per page</label>

            <select
                id="pageSize"
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>

            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
};

export default Pagination;