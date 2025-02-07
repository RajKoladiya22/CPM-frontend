import React from "react";
import { Modal, Button, Table } from "react-bootstrap";
import "../assets/css/index.css"; // Import the CSS file

const CustomerDetailModal = ({ show, onHide, customer }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Customer Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover className="customer-detail-table">
          <tbody>
            <tr>
              <td><strong>Company Name:</strong></td>
              <td>{customer.companyName}</td>
            </tr>
            <tr>
              <td><strong>Contact Person:</strong></td>
              <td>{customer.contactPerson}</td>
            </tr>
            <tr>
              <td><strong>Mobile Number :</strong></td>
              <td>{customer.mobileNumber}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{customer.email}</td>
            </tr>
            <tr>
              <td><strong>Tally Serial Number:</strong></td>
              <td>{customer.tallySerialNo}</td>
            </tr>
            <tr>
              <td><strong>Prime:</strong></td>
              <td>{customer.prime ? "✔ Yes" : "❌ No"}</td>
            </tr>
            <tr>
              <td><strong>Blacklisted:</strong></td>
              <td>{customer.blacklisted ? "✔ Yes" : "❌ No"}</td>
            </tr>

            <tr>
              <td><strong>Remark:</strong></td>
              <td>{customer.remark || "N/A"}</td>
            </tr>

            {/* Dynamic Fields */}
            {Object.keys(customer.dynamicFields).map((key) => {
              const value = customer.dynamicFields[key];

              let displayValue;
              if (typeof value === "boolean") {
                displayValue = value ? "✔ Yes" : "❌ No";
              } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                const [year, month, day] = value.split("-");
                displayValue = `${day}/${month}/${year}`;
              } else {
                displayValue = value;
              }

              return (
                <tr key={key}>
                  <td><strong>{key}:</strong></td>
                  <td>{displayValue}</td>
                </tr>
              );
            })}
            {/* {Object.keys(customer.dynamicFields).map((key) => {
              const value = customer.dynamicFields[key];

              let displayValue;
              let rowClass = ""; // Default row class

              if (typeof value === "boolean") {
                displayValue = value ? "✔ Yes" : "❌ No";
                rowClass = value ? "status-red" : "status-green"; // Apply conditional styling
              } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                const [year, month, day] = value.split("-");
                displayValue = `${day}/${month}/${year}`;
              } else {
                displayValue = value;
              }

              return (
                <tr key={key} className={rowClass}>
                  <td><strong>{key}:</strong></td>
                  <td>{displayValue}</td>
                </tr>
              );
            })} */}

          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerDetailModal;
