import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, getCustomFields } from "../redux/actions/customerActions";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCustomFieldButton from "./AddCustomFieldButton";
import "../assets/css/sidebar.css";

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
        prime: "",
        blacklited: "",
        remark: "",
        dynamicFields: {},
    });

    useEffect(() => {
        dispatch(getCustomFields()); // Fetch custom fields on load
    }, [dispatch]);

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
        console.log(formData);

        dispatch(addCustomer(formData))
            .then(() => {
                setFormData({
                    companyName: "",
                    contactPerson: "",
                    mobileNumber: "",
                    email: "",
                    prime: "",
                    blacklited: "",
                    remark: "",
                    tallySerialNo: "",
                    dynamicFields: {},
                });
            });
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
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Tally Serial Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="tallySerialNo"
                                    value={formData.tallySerialNo}
                                    onChange={handleChange}
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
                                            required={field.isRequired}
                                        />
                                    )}
                                    {field.fieldType === "number" && (
                                        <Form.Control
                                            type="number"
                                            name={field.fieldName}
                                            value={formData.dynamicFields[field.fieldName] || ""}
                                            onChange={(e) => handleDynamicChange(e, field.fieldName)}
                                            required={field.isRequired}
                                        />
                                    )}
                                    {field.fieldType === "email" && (
                                        <Form.Control
                                            type="email"
                                            name={field.fieldName}
                                            value={formData.dynamicFields[field.fieldName] || ""}
                                            onChange={(e) => handleDynamicChange(e, field.fieldName)}
                                            required={field.isRequired}
                                        />
                                    )}
                                    {field.fieldType === "checkbox" && (
                                        // <Form.Check
                                        //     type="checkbox"
                                        //     label={field.fieldName}
                                        //     name={field.fieldName}
                                        //     checked={formData.dynamicFields[field.fieldName] || false}
                                        //     onChange={(e) => handleDynamicChange(e, field.fieldName)}
                                        // />
                                        <Form.Check
                                            type="switch"
                                            id={field.fieldName}
                                            label=""
                                            name={field.fieldName}
                                            checked={formData.dynamicFields[field.fieldName] || false}
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
