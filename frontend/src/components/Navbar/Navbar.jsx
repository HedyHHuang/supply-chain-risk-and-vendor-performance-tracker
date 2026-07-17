import PropTypes from "prop-types";
import "./Navbar.css";

function Navbar({ onPageChange }) {
    return (
        <header className="navbar">
            <div>
                <p className="navbar-eyebrow">Supply Chain Operations</p>
                <h1>Risk & Vendor Performance Tracker</h1>
            </div>

            <nav className="navbar-nav" aria-label="Main navigation">
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