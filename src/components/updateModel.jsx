import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomFields, updateCustomer } from "../redux/actions/customerActions";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const UpdateCustomerModal = ({ show, handleClose, customerData }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.customer || []);
  const { customFields } = useSelector((state) => state.customField) || { customFields: [] };;
  // console.log(customFields);

  const [formData, setFormData] = useState({});

  // useEffect(() => {
  //   if (customerData) {
  //     setFormData(customerData);
  //     setFormData({
  //       ...customerData,
  //       dynamicFields: customerData.dynamicFields || {}
  //     });
  //   }
  //   dispatch(getCustomFields());
  // }, [customerData, dispatch]);
  useEffect(() => {
    if (customerData) {
      setFormData({
        ...customerData,
        blacklisted: customerData.blacklisted ?? false, // Ensure boolean
        prime: customerData.prime ?? false, // Ensure boolean
        dynamicFields: customerData.dynamicFields || {},
      });
    }
    dispatch(getCustomFields());
  }, [customerData, dispatch]);


  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleChange = (e) => {
  //   const { name, type, checked, value } = e.target;

  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: type === "checkbox" ? checked : value, // Ensure checkboxes store boolean values
  //   }));
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "blacklisted" && checked) {
      setFormData({
        ...formData,
        blacklisted: true,
        prime: false, // Automatically deselect Prime
      });
    } else if (name === "prime" && checked) {
      setFormData({
        ...formData,
        blacklisted: false, // Automatically deselect Blacklisted
        prime: true,
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value, // Ensure checkboxes store boolean values
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);

    dispatch(updateCustomer(customerData._id, formData)).then(() => {
      handleClose();
    });
  };

  // const handleDynamicChange = (e, fieldName) => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     dynamicFields: {
  //       ...prevFormData.dynamicFields,
  //       [fieldName]: e.target.value
  //     }
  //   }));
  // };
  const handleDynamicChange = (e, fieldName) => {
    const { target } = e;
    const { type, checked, value } = target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      dynamicFields: {
        ...prevFormData.dynamicFields,
        [fieldName]: type === "checkbox" ? checked : value, // Ensure checkboxes store boolean values
      },
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

            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              type="text"
              name="contactPerson"
              value={formData.contactPerson || ""}
              onChange={handleChange}

            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber || ""}
              onChange={handleChange}

            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}

            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tally Serial No.</Form.Label>
            <Form.Control
              type="number"
              name="tallySerialNo"
              value={formData.tallySerialNo || ""}
              onChange={handleChange}

            />
          </Form.Group>

          <div className="d-flex align-items-center gap-4">
            <Form.Group controlId="blacklisted" className="d-flex align-items-baseline">
              <Form.Label className="me-2">Blacklisted</Form.Label>
              <Form.Check
                type="switch"
                id="blacklisted-switch"
                name="blacklisted"
                checked={!!formData.blacklisted}
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
                checked={!!formData.prime}
                onChange={handleChange}
              />
            </Form.Group>
          </div>

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
                  name={field.fieldName}
                  checked={!!formData.dynamicFields?.[field.fieldName]} // Ensures boolean value
                  onChange={(e) => handleDynamicChange(e, field.fieldName)}
                  required={field.isRequired}
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


          <Button type="submit" className="mt-3 btn-primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Update"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateCustomerModal;
