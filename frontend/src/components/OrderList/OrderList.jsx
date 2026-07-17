import PropTypes from "prop-types";
import "./OrderList.css";

function OrderList({ orders, onEditOrder, onDeleteOrder }) {
    return (
        <section className="order-list">
            <div className="list-heading">
                <div>
                    <p className="section-eyebrow">Purchase Order Monitoring</p>
                    <h2>Orders</h2>
                </div>

                <span>{orders.length} shown</span>
            </div>

            {orders.length === 0 ? (
                <p className="empty-message">No orders available.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>PO Number</th>
                                <th>Vendor</th>
                                <th>Item</th>
                                <th>Expected</th>
                                <th>Actual</th>
                                <th>Ordered</th>
                                <th>Received</th>
                                <th>Issue</th>
                                <th>Risk</th>
                                <th>Status</th>
                                <th>Corrective Action</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <strong>{order.poNumber}</strong>
                                    </td>
                                    <td>{order.vendorName}</td>
                                    <td>{order.itemName}</td>
                                    <td>{order.expectedDeliveryDate}</td>
                                    <td>{order.actualDeliveryDate || "N/A"}</td>
                                    <td>{order.orderedQuantity}</td>
                                    <td>{order.receivedQuantity || "N/A"}</td>
                                    <td>{order.issueType}</td>
                                    <td>
                                        <span
                                            className={`badge risk-${order.riskLevel
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                        >
                                            {order.riskLevel}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge status-${order.status
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{order.correctiveAction || "N/A"}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                onClick={() => onEditOrder(order)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() => onDeleteOrder(order.id)}
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

OrderList.propTypes = {
    orders: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            poNumber: PropTypes.string.isRequired,
            vendorName: PropTypes.string.isRequired,
            itemName: PropTypes.string.isRequired,
            expectedDeliveryDate: PropTypes.string.isRequired,
            actualDeliveryDate: PropTypes.string,
            orderedQuantity: PropTypes.string.isRequired,
            receivedQuantity: PropTypes.string,
            issueType: PropTypes.string.isRequired,
            correctiveAction: PropTypes.string,
            status: PropTypes.string.isRequired,
            riskLevel: PropTypes.string.isRequired,
        }),
    ).isRequired,
    onEditOrder: PropTypes.func.isRequired,
    onDeleteOrder: PropTypes.func.isRequired,
};

export default OrderList;