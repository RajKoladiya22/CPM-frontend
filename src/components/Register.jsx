import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/actions/authActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", registrationCode: "" });
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth) || { loading: false, error: null };

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

    dispatch(registerUser(formData, navigate));



  };

  return (
    <Container className="d-flex justify-content-center align-items-center  regiter-box">
      <ToastContainer />
      <Row className="w-100">
        <Col xs={12} md={8} lg={5} className="mx-auto">
          <div className="p-4 shadow-lg rounded bg-white">
            <h2 className="text-center mb-4 text-primary">Register</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" placeholder="Enter username" onChange={handleChange} required />
                <Form.Control.Feedback type="invalid">Username is required.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
                <Form.Control.Feedback type="invalid">Please enter a valid email.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="password" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
                <Form.Control.Feedback type="invalid">Password is required.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="registrationCode" className="mt-3">
                <Form.Label>Registration Code</Form.Label>
                <Form.Control type="text" name="registrationCode" placeholder="Enter registration code" onChange={handleChange} required />
                <Form.Control.Feedback type="invalid">Registration code is required.</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit"
                className="login-btn login-btn-primary mt-4" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Registear"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
