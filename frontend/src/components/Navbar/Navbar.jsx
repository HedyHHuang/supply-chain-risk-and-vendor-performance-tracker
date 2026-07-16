import PropTypes from "prop-types";
import "./Navbar.css";

function Navbar({ onPageChange }) {
    return (
        <header className="navbar">
            <h1>Supply Chain Risk & Vendor Performance Tracker</h1>

            <nav>
                <button type="button" onClick={() => onPageChange("orders")}>
                    Orders
                </button>

                <button type="button" onClick={() => onPageChange("scorecards")}>
                    Vendor Scorecards
                </button>
            </nav>
        </header>
    );
}

Navbar.propTypes = {
    onPageChange: PropTypes.func.isRequired,
};

export default Navbar;