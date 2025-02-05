import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomFields, updateCustomer } from "../redux/actions/customerActions";
import { Modal, Button, Form } from "react-bootstrap";

const UpdateCustomerModal = ({ show, handleClose, customerData }) => {
  const dispatch = useDispatch();
  const { customFields } = useSelector((state) => state.customFields) || { customFields: [] };;

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (customerData) {
      setFormData(customerData);
    }
    dispatch(getCustomFields());
  }, [customerData, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCustomer(customerData._id, formData)).then(() => {
      handleClose();
    });
  };

  return (
    <Modal show={show} onHide={handleClose} className="mt-5">
      <Modal.Header closeButton>
        <Modal.Title>Update Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              value={formData.companyName|| ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              type="text"
              name="contactPerson"
              value={formData.contactPerson || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tally Serial No.</Form.Label>
            <Form.Control
              type="number"
              name="tallySerialNo"
              value={formData.tallySerialNo || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Remark</Form.Label>
            <Form.Control
              type="text"
              name="remark"
              value={formData.remark || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {customFields &&
            customFields.map((field) => (
              <Form.Group key={field._id}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type="text"
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}
          <Button variant="primary" type="submit" className="mt-2">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateCustomerModal;
