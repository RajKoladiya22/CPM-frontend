import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, getCustomFields } from "../redux/actions/customerActions";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCustomFieldButton from "./AddCustomFieldButton";
import Select from "react-select";
import "../assets/css/index.css";

const ClientForm = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.customer || []);
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

    
    useEffect(() => {
        dispatch(getCustomFields());
    }, [dispatch]);
    
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};

        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required.";
        if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required.";
        if (!formData.mobileNumber.match(/^[0-9]{10}$/)) newErrors.mobileNumber = "Mobile number must be 10 digits.";
        if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            newErrors.email = "Invalid email format.";
        }
        if (!formData.tallySerialNo) {
            newErrors.tallySerialNo = "Tally Serial Number must be a number.";
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
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    const handleDynamicChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            dynamicFields: {
                ...prevData.dynamicFields,
                [field]: value,
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            dispatch(addCustomer(formData))
                .then(() => {
                    toast.success("Customer added successfully");
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
                            {/* Standard Fields */}
                            {[
                                { label: "Company Name", name: "companyName", type: "text" },
                                { label: "Contact Person", name: "contactPerson", type: "text" },
                                { label: "Mobile Number", name: "mobileNumber", type: "tel" },
                                { label: "Email", name: "email", type: "email" },
                                { label: "Tally Serial Number", name: "tallySerialNo", type: "number" },
                            ].map(({ label, name, type }) => (
                                <Form.Group key={name}>
                                    <Form.Label>{label}</Form.Label>
                                    <Form.Control
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        isInvalid={!!errors[name]}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
                                </Form.Group>
                            ))}
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
                            {/* Dynamic Custom Fields */}
                            {customFields.map((field) => (
                                <Form.Group key={field._id}>
                                    <Form.Label>{field.fieldName}</Form.Label>
                                    {field.fieldType === "dropdown" && (
                                        <Select
                                            options={field.options.map((opt) => ({ value: opt, label: opt }))}
                                            isMulti={field.isMultiSelect}
                                            name={field.fieldName}
                                            value={field.isMultiSelect
                                                ? formData.dynamicFields[field.fieldName] || []
                                                : formData.dynamicFields[field.fieldName] || ""}
                                            onChange={(selected) => handleDynamicChange(field.fieldName, field.isMultiSelect ? selected : selected.value)}
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
