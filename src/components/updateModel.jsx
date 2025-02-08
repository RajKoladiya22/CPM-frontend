import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomFields, updateCustomer } from "../redux/actions/customerActions";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";

const UpdateCustomerModal = ({ show, handleClose, customerData }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.customer || []);
  const { customFields } = useSelector((state) => state.customField) || { customFields: [] };

  const [formData, setFormData] = useState({});

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

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let newErrors = {};

    if (!formData.companyName?.trim()) newErrors.companyName = "Company name is required.";
    if (!formData.contactPerson?.trim()) newErrors.contactPerson = "Contact person is required.";
    if (!formData.mobileNumber?.match(/^[0-9]{10}$/)) newErrors.mobileNumber = "Mobile number must be 10 digits.";
    if (!formData.email?.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.tallySerialNo) {
      newErrors.tallySerialNo = "Tally Serial Number is required.";
    }

    customFields.forEach((field) => {
      if (field.isRequired && !formData.dynamicFields[field.fieldName]?.trim()) {
        newErrors[field.fieldName] = `${field.fieldName} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleDynamicChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dynamicFields: {
        ...prevFormData.dynamicFields,
        [fieldName]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
            <Form.Control type="text" name="companyName" value={formData.companyName || ""} onChange={handleChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Contact Person</Form.Label>
            <Form.Control type="text" name="contactPerson" value={formData.contactPerson || ""} onChange={handleChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control type="text" name="mobileNumber" value={formData.mobileNumber || ""} onChange={handleChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email || ""} onChange={handleChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Tally Serial No.</Form.Label>
            <Form.Control type="number" name="tallySerialNo" value={formData.tallySerialNo || ""} onChange={handleChange} />
          </Form.Group>

          <div className="d-flex align-items-center gap-4">
            <Form.Group controlId="blacklisted" className="d-flex align-items-baseline">
              <Form.Label className="me-2">Blacklisted</Form.Label>
              <Form.Check type="switch" name="blacklisted" checked={!!formData.blacklisted} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="prime" className="d-flex align-items-baseline">
              <Form.Label className="me-2">Prime</Form.Label>
              <Form.Check type="switch" name="prime" checked={!!formData.prime} onChange={handleChange} />
            </Form.Group>
          </div>

          <Form.Group>
            <Form.Label>Remark</Form.Label>
            <Form.Control type="text" name="remark" value={formData.remark || ""} onChange={handleChange} required />
          </Form.Group>

          {/* Dynamic Custom Fields */}
          {customFields.map((field) => (
            <Form.Group key={field._id}>
              <Form.Label>{field.fieldName}</Form.Label>
              {field.fieldType === "dropdown" && (
                <Select
                  options={field.options.map((opt) => ({ value: opt, label: opt }))}
                  isMulti={field.isMultiSelect}
                  name={field.fieldName}
                  value={
                    field.isMultiSelect
                      ? (formData.dynamicFields[field.fieldName] || []).map((opt) =>
                        typeof opt === "object" ? opt : { value: opt, label: opt }
                      )
                      : formData.dynamicFields[field.fieldName]
                        ? { value: formData.dynamicFields[field.fieldName], label: formData.dynamicFields[field.fieldName] }
                        : null
                  }
                  getOptionLabel={(e) => e.label}
                  getOptionValue={(e) => e.value}
                  onChange={(selected) =>
                    handleDynamicChange(
                      field.fieldName,
                      field.isMultiSelect ? selected.map((opt) => opt.value) : selected?.value || ""
                    )
                  }
                />

              )}
              {["text", "number", "email", "date"].includes(field.fieldType) && (
                <Form.Control
                  type={field.fieldType}
                  name={field.fieldName}
                  value={formData.dynamicFields[field.fieldName] || ""}
                  onChange={(e) => handleDynamicChange(field.fieldName, e.target.value)}
                  isInvalid={!!errors[field.fieldName]}
                />
              )}
              {field.fieldType === "checkbox" && (
                <Form.Check
                  type="switch"
                  id={field.fieldName}
                  name={field.fieldName}
                  checked={!!formData.dynamicFields[field.fieldName]}
                  onChange={(e) => handleDynamicChange(field.fieldName, e.target.checked)}
                />
              )}
              <Form.Control.Feedback type="invalid">{errors[field.fieldName]}</Form.Control.Feedback>
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
