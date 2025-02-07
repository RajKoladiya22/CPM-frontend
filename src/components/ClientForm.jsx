import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, getCustomFields } from "../redux/actions/customerActions";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCustomFieldButton from "./AddCustomFieldButton";
import "../assets/css/index.css";

const ClientForm = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.customer || []);
    // console.log(loading);

    const { customFields } = useSelector((state) => state.customField) || { customFields: [] };

    const [formData, setFormData] = useState({
        companyName: "",
        contactPerson: "",
        mobileNumber: "",
        email: "",
        tallySerialNo: "",
        prime: false,
        blacklisted: false,
        remark: "",
        dynamicFields: {},
    });

    const [errors, setErrors] = useState({});
    useEffect(() => {
        dispatch(getCustomFields()); // Fetch custom fields on load
    }, [dispatch]);

    const validateForm = () => {
        let newErrors = {};

        // Basic field validations
        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required.";
        if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required.";
        if (!formData.mobileNumber.match(/^[0-9]{10}$/)) newErrors.mobileNumber = "Mobile number must be 10 digits.";
        if (!formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }
        if (!formData.tallySerialNo) {
            newErrors.tallySerialNo = "Tally Serial Number must be a number.";
        }

        // Validate dynamic fields
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
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleDynamicChange = (e, fieldName) => {
        const { value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            dynamicFields: {
                ...prevData.dynamicFields,
                [fieldName]: type === "checkbox" ? checked : value,
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            dispatch(addCustomer(formData))
                .then(() => {
                    setFormData({
                        companyName: "",
                        contactPerson: "",
                        mobileNumber: "",
                        email: "",
                        tallySerialNo: "",
                        prime: false,
                        blacklisted: false,
                        remark: "",
                        dynamicFields: {},
                    });
                    // toast.success("Customer added successfully!");
                })
                .catch(() => toast.error("Failed to add customer."));
        }
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <AddCustomFieldButton />
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <div className="client-form-container">
                        <h2 className="text-center my-4">Add Customer</h2>
                        <Form onSubmit={handleSubmit} className="client-form">
                            <Form.Group>
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.companyName}
                                />
                                <Form.Control.Feedback type="invalid">{errors.companyName}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    isInvalid={!!errors.contactPerson}
                                />
                                <Form.Control.Feedback type="invalid">{errors.contactPerson}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    isInvalid={!!errors.mobileNumber}
                                />
                                <Form.Control.Feedback type="invalid">{errors.mobileNumber}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Tally Serial Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="tallySerialNo"
                                    value={formData.tallySerialNo}
                                    onChange={handleChange}
                                    isInvalid={!!errors.tallySerialNo}
                                />
                                <Form.Control.Feedback type="invalid">{errors.tallySerialNo}</Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex align-items-center gap-4">
                                <Form.Group controlId="blacklisted" className="d-flex align-items-baseline">
                                    <Form.Label className="me-2">Blacklisted</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="blacklisted-switch"
                                        name="blacklisted"
                                        checked={!!formData.blacklisted} // Ensure boolean value
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="prime" className="d-flex align-items-baseline">
                                    <Form.Label className="me-2">Prime</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="prime-switch"
                                        name="prime"
                                        checked={!!formData.prime} // Ensure boolean value
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>



                            <Form.Group>
                                <Form.Label>Remark</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            {/* Dynamic Custom Fields */}
                            {customFields.map((field) => (
                                <Form.Group key={field._id} className="dynamic-field-group ">
                                    <Form.Label>{field.fieldName}</Form.Label>
                                    {field.fieldType === "text" && (
                                        <Form.Control
                                            type="text"
                                            name={field.fieldName}
                                            value={formData.dynamicFields[field.fieldName] || ""}
                                            onChange={(e) => handleDynamicChange(e, field.fieldName)}
                                            isInvalid={!!errors[field.fieldName]}
                                        // required={field.isRequired}
                                        />

                                    )}
                                    {field.fieldType === "number" && (
                                        <Form.Control
                                            type="number"
                                            name={field.fieldName}
                                            value={formData.dynamicFields[field.fieldName] || ""}
                                            onChange={(e) => handleDynamicChange(e, field.fieldName)}
                                            isInvalid={!!errors[field.fieldName]}
                                        // required={field.isRequired}
                                        />
                                    )}
                                    {field.fieldType === "email" && (
                                        <Form.Control
                                            type="email"
                                            name={field.fieldName}
                                            value={formData.dynamicFields[field.fieldName] || ""}
                                            onChange={(e) => handleDynamicChange(e, field.fieldName)}
                                            isInvalid={!!errors[field.fieldName]}
                                        // required={field.isRequired}
                                        />
                                    )}
                                    {field.fieldType === "checkbox" && (
                                        <Form.Check
                                            type="switch"
                                            id={field.fieldName}
                                            name={field.fieldName}
                                            checked={!!formData.dynamicFields[field.fieldName]} // Ensure boolean default
                                            onChange={(e) => handleDynamicChange(e, field.fieldName)}
                                            className="m-2"
                                        />

                                    )}
                                    {field.fieldType === "date" && (
                                        <Form.Control
                                            type="date"
                                            name={field.fieldName}
                                            value={formData.dynamicFields[field.fieldName] || ""}
                                            onChange={(e) => handleDynamicChange(e, field.fieldName)}
                                        />
                                    )}
                                    <Form.Control.Feedback type="invalid">{errors[field.fieldName]}</Form.Control.Feedback>
                                </Form.Group>
                            ))}

                            <Button type="submit" className="mt-3 btn-primary" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ClientForm;
