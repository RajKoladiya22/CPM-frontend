import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { updateCustomField } from "../redux/actions/customerActions";
import { toast } from "react-toastify";

const UpdateCustomFieldModal = ({ fieldToEdit, show, handleClose }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.customField);
    
    const [fieldData, setFieldData] = useState({
        fieldName: "",
        fieldType: "text",
        isRequired: false,
    });

    useEffect(() => {
        if (fieldToEdit) {
            setFieldData({
                fieldName: fieldToEdit.fieldName,
                fieldType: fieldToEdit.fieldType,
                isRequired: fieldToEdit.isRequired,
            });
        }
    }, [fieldToEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFieldData({
            ...fieldData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fieldToEdit) return; // Prevents submitting if no field is selected

        try {
            await dispatch(updateCustomField(fieldToEdit._id, fieldData));
            // toast.success("Custom field updated successfully!");
            handleClose(); // Close modal after update
        } catch (error) {
            // toast.error("Failed to update custom field");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Custom Field</Modal.Title>
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
                        {loading ? <Spinner animation="border" size="sm" /> : "Update Field"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateCustomFieldModal;
