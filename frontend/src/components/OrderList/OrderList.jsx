import PropTypes from "prop-types";
import "./OrderList.css";

function OrderList({ orders, onEditOrder, onDeleteOrder }) {
    return (
        <section className="order-list">
            <h2>Orders</h2>

            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            <strong>{order.poNumber}</strong>
                            <br />
                            Vendor: {order.vendorName}
                            <br />
                            Item: {order.itemName}
                            <br />
                            Expected Delivery: {order.expectedDeliveryDate}
                            <br />
                            Actual Delivery: {order.actualDeliveryDate || "N/A"}
                            <br />
                            Ordered Qty: {order.orderedQuantity}
                            <br />
                            Received Qty: {order.receivedQuantity || "N/A"}
                            <br />
                            Issue Type: {order.issueType}
                            <br />
                            Risk Level: {order.riskLevel}
                            <br />
                            Status: {order.status}
                            <br />
                            Corrective Action: {order.correctiveAction || "N/A"}
                            <br />
                            <button
                                type="button"
                                onClick={() => onDeleteOrder(order.id)}
                            >
                                Delete
                            </button>
                            <br />
                            <button type="button" onClick={() => onEditOrder(order)}>
                                Edit
                            </button>

                        </li>
                    ))}
                </ul>
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
            onEditOrder: PropTypes.func.isRequired,
            onDeleteOrder: PropTypes.func.isRequired,
        }),
    ).isRequired,
    onDeleteOrder: PropTypes.func.isRequired,
};

export default OrderList;