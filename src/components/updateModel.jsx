import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomFields, updateCustomer } from "../redux/actions/customerActions";
import { Modal, Button, Form } from "react-bootstrap";

const UpdateCustomerModal = ({ show, handleClose, customerData }) => {
  const dispatch = useDispatch();
  const { customFields } = useSelector((state) => state.customField) || { customFields: [] };;
  // console.log(customFields);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (customerData) {
      setFormData(customerData);
      setFormData({
        ...customerData,
        dynamicFields: customerData.dynamicFields || {}
      });
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

  const handleDynamicChange = (e, fieldName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dynamicFields: {
        ...prevFormData.dynamicFields,
        [fieldName]: e.target.value
      }
    }));
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
              value={formData.companyName || ""}
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

          {/* <div className="d-flex align-items-center gap-4">
            <Form.Group controlId="blacklisted" className="d-flex align-items-baseline">
              <Form.Label className="me-2">Blacklisted</Form.Label>
              <Form.Check
                type="switch"
                id="blacklisted-switch"
                label=""
                name="blacklited"
                checked={formData.blacklited}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="prime" className="d-flex align-items-baseline">
              <Form.Label className="me-2">Prime</Form.Label>
              <Form.Check
                type="switch"
                id="prime-switch"
                label=""
                name="prime"
                checked={formData.prime}
                onChange={handleChange}
              />
            </Form.Group>
          </div> */}

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
          {/* Dynamic Custom Fields */}
          {/* {customFields &&
            customFields.map((field) => (
              <Form.Group key={field._id}>
                <Form.Label>{field.fieldName}</Form.Label>
                <Form.Control
                  // Use field.type if provided; otherwise default to "text"
                  type={field.type || "text"}
                  name={field.fieldName}
                  value={(formData.dynamicFields && formData.dynamicFields[field.fieldName]) || ""}
                  onChange={(e) => handleDynamicChange(e, field.fieldName)}
                />
              </Form.Group>
            ))} */}
          {customFields.map((field) => (
            <Form.Group key={field._id} className="dynamic-field-group">
              <Form.Label>{field.fieldName}</Form.Label>

              {field.fieldType === "text" && (
                <Form.Control
                  type="text"
                  name={field.fieldName}
                  value={formData.dynamicFields?.[field.fieldName] || ""}
                  onChange={(e) => handleDynamicChange(e, field.fieldName)}
                  required={field.isRequired}
                />
              )}

              {field.fieldType === "number" && (
                <Form.Control
                  type="number"
                  name={field.fieldName}
                  value={formData.dynamicFields?.[field.fieldName] || ""}
                  onChange={(e) => handleDynamicChange(e, field.fieldName)}
                  required={field.isRequired}
                />
              )}

              {field.fieldType === "email" && (
                <Form.Control
                  type="email"
                  name={field.fieldName}
                  value={formData.dynamicFields?.[field.fieldName] || ""}
                  onChange={(e) => handleDynamicChange(e, field.fieldName)}
                  required={field.isRequired}
                />
              )}

              {field.fieldType === "checkbox" && (
                <Form.Check
                  type="switch"
                  id={field.fieldName}
                  label=""
                  name={field.fieldName}
                  checked={formData.dynamicFields?.[field.fieldName] || false}
                  onChange={(e) => handleDynamicChange(e, field.fieldName)}
                  className="m-2"
                />
              )}

              {field.fieldType === "date" && (
                <Form.Control
                  type="date"
                  name={field.fieldName}
                  value={formData.dynamicFields?.[field.fieldName] || ""}
                  onChange={(e) => handleDynamicChange(e, field.fieldName)}
                />
              )}
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
