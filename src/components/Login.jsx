import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/authActions";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/sidebar.css"; // Import the new CSS file

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth) || { loading: false, error: null };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        setValidated(true);
        dispatch(loginUser(formData, navigate));
    };

    return (
        <Container className="login-container login-box">
            <ToastContainer />
            <Row className="w-100">
                <Col xs={12} md={8} lg={5} className="mx-auto">
                    <div className="login-card">
                        <h2 className="login-title text-center">Login</h2>

                        {error && <Alert variant="danger" className="login-alert">{error}</Alert>}

                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    name="email" 
                                    placeholder="Enter email" 
                                    onChange={handleChange} 
                                    required 
                                    className="login-input"
                                />
                                <Form.Control.Feedback type="invalid">Please enter a valid email.</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="password" className="mt-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    name="password" 
                                    placeholder="Enter password" 
                                    onChange={handleChange} 
                                    required 
                                    className="login-input"
                                />
                                <Form.Control.Feedback type="invalid">Password is required.</Form.Control.Feedback>
                            </Form.Group>

                            <Button 
                                type="submit" 
                                className="login-btn login-btn-primary mt-4" 
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
