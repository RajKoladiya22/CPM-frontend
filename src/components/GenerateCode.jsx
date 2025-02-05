import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateAdminCode, generateUserCode } from "../redux/actions/codeActions";
import { Button, Container, Row, Col, Spinner, Card, Form, InputGroup } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/sidebar.css"

const GenerateCode = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { loadingAdmin, loadingUser, adminCode, userCode } = useSelector((state) => state.codes || {});
    
    const [username, setUsername] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleGenerateAdminCode = () => {
        console.log(username);
        
        if (username.trim()) dispatch(generateAdminCode(username));
    };

    const handleGenerateUserCode = () => {
        if (username.trim()) dispatch(generateUserCode(username));
    };

    return (
        <Container className="generate-code-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <Row className="w-100">
                <Col xs={12} md={8} lg={6} className="mx-auto">
                    <Card className="generate-card">
                        <h2 className="generate-title">Generate Registration Codes</h2>

                        <Form.Group className="mb-3">
                            <Form.Label>Enter Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter Name"
                                className="generate-input"
                            />
                        </Form.Group>

                        {user?.role === "superadmin" && (
                            <div className="mb-4">
                                <Button
                                    className="generate-btn generate-btn-primary"
                                    onClick={handleGenerateAdminCode}
                                    disabled={loadingAdmin || !username.trim()}
                                >
                                    {loadingAdmin ? <Spinner animation="border" size="sm" /> : "Generate Admin Code"}
                                </Button>
                                {adminCode && (
                                    <InputGroup className="mt-3">
                                        <Form.Control value={adminCode} readOnly />
                                        <CopyToClipboard text={adminCode} onCopy={() => setCopied(true)}>
                                            <Button className="copy-btn">📋</Button>
                                        </CopyToClipboard>
                                    </InputGroup>
                                )}
                            </div>
                        )}

                        {user?.role === "admin" && (
                            <div>
                                <Button
                                    className="generate-btn generate-btn-success"
                                    onClick={handleGenerateUserCode}
                                    disabled={loadingUser || !username.trim()}
                                >
                                    {loadingUser ? <Spinner animation="border" size="sm" /> : "Generate User Code"}
                                </Button>
                                {userCode && (
                                    <InputGroup className="mt-3">
                                        <Form.Control value={userCode} readOnly />
                                        <CopyToClipboard text={userCode} onCopy={() => setCopied(true)}>
                                            <Button className="copy-btn">📋</Button>
                                        </CopyToClipboard>
                                    </InputGroup>
                                )}
                            </div>
                        )}
                        {copied && <p className="copied-message">Copied!</p>}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default GenerateCode;
