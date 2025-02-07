import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { addCustomField } from "../redux/actions/customerActions"; // Redux action
import { toast } from "react-toastify";
import "../assets/css/index.css"; // Import custom CSS
import { FaPlus  } from "react-icons/fa";

const AddCustomFieldButton = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.customField || []);

  // console.log(loading);
  
  const [show, setShow] = useState(false);
  const [fieldData, setFieldData] = useState({
    fieldName: "",
    fieldType: "text",
    isRequired: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFieldData({
      ...fieldData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addCustomField(fieldData)); // Dispatch Redux action
      // toast.success("Custom field added successfully!");
      setShow(false); // Close modal
      setFieldData({ fieldName: "", fieldType: "text", isRequired: false }); // Reset form
    } catch (error) {
      toast.error("Failed to add custom field");
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button className="add-field-button" onClick={() => setShow(true)}>
        <FaPlus/> Add Custom Field
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add Custom Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Field Name</Form.Label>
              <Form.Control
                type="text"
                name="fieldName"
                value={fieldData.fieldName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Field Type</Form.Label>
              <Form.Control
                as="select"
                name="fieldType"
                value={fieldData.fieldType}
                onChange={handleChange}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="email">Email</option>
                <option value="checkbox">Checkbox</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Required Field"
                name="isRequired"
                checked={fieldData.isRequired}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" className="mt-3 btn-primary" disabled={loading}>
               {loading ? <Spinner animation="border" size="sm" /> : "Save Field "}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddCustomFieldButton;
