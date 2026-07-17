import { useState } from "react";
import PropTypes from "prop-types";
import "./OrderForm.css";

const emptyFormData = {
    poNumber: "",
    vendorName: "",
    itemName: "",
    expectedDeliveryDate: "",
    actualDeliveryDate: "",
    orderedQuantity: "",
    receivedQuantity: "",
    issueType: "None",
    correctiveAction: "",
    status: "Open",
};

function OrderForm({
    editingOrder,
    onAddOrder,
    onUpdateOrder,
    onCancelEdit,
}) {
    const [formData, setFormData] = useState(
        editingOrder ?? emptyFormData,
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

        if (editingOrder) {
            onUpdateOrder(formData);
        } else {
            onAddOrder(formData);
        }

        setFormData(emptyFormData);
    }

    function handleCancel() {
        setFormData(emptyFormData);
        onCancelEdit();
    }

    return (
        <form className="order-form" onSubmit={handleSubmit}>
            <h2>{editingOrder ? "Edit Order" : "Add Order"}</h2>

            <label htmlFor="poNumber">PO Number</label>
            <input
                id="poNumber"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleChange}
                required
            />

            <label htmlFor="vendorName">Vendor Name</label>
            <input
                id="vendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                required
            />

            <label htmlFor="itemName">Item Name</label>
            <input
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
            />

            <label htmlFor="expectedDeliveryDate">Expected Delivery Date</label>
            <input
                id="expectedDeliveryDate"
                name="expectedDeliveryDate"
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
                required
            />

            <label htmlFor="actualDeliveryDate">Actual Delivery Date</label>
            <input
                id="actualDeliveryDate"
                name="actualDeliveryDate"
                type="date"
                value={formData.actualDeliveryDate}
                onChange={handleChange}
            />

            <label htmlFor="orderedQuantity">Ordered Quantity</label>
            <input
                id="orderedQuantity"
                name="orderedQuantity"
                type="number"
                min="1"
                value={formData.orderedQuantity}
                onChange={handleChange}
                required
            />

            <label htmlFor="receivedQuantity">Received Quantity</label>
            <input
                id="receivedQuantity"
                name="receivedQuantity"
                type="number"
                min="0"
                value={formData.receivedQuantity}
                onChange={handleChange}
            />

            <label htmlFor="issueType">Issue Type</label>
            <select
                id="issueType"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
            >
                <option value="None">None</option>
                <option value="Late Delivery">Late Delivery</option>
                <option value="Quantity Shortage">Quantity Shortage</option>
                <option value="Quality Issue">Quality Issue</option>
            </select>

            <label htmlFor="correctiveAction">Corrective Action</label>
            <textarea
                id="correctiveAction"
                name="correctiveAction"
                value={formData.correctiveAction}
                onChange={handleChange}
            />

            <label htmlFor="status">Status</label>
            <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
            >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
            </select>

            <button type="submit">
                {editingOrder ? "Update Order" : "Add Order"}
            </button>

            {editingOrder && (
                <button type="button" onClick={handleCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
}

OrderForm.propTypes = {
    editingOrder: PropTypes.shape({
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
    onAddOrder: PropTypes.func.isRequired,
    onUpdateOrder: PropTypes.func.isRequired,
    onCancelEdit: PropTypes.func.isRequired,
};

OrderForm.defaultProps = {
    editingOrder: null,
};

export default OrderForm;