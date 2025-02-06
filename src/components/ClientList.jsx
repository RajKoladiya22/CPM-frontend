import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomer, deleteCustomer, updateCustomer } from "../redux/actions/customerActions";
import { Table, Row, Col, Form, Button, Spinner, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerDetailModal from "./CustomerDetailModal";
import "../assets/css/sidebar.css"; // Import custom CSS
import UpdateCustomerModal from "./updateModel"
import setShowUpdateModal from "./updateModel"

const ClientList = () => {
    const [searchQuery, setSearchQuery] = useState({
        companyName: "",
        mobileNumber: "",
        contactPerson: "",
        tallySerialNo: ""
    });

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const dispatch = useDispatch();
    const { customers, loading, error } = useSelector((state) => state.customer);
    const { user } = useSelector((state) => state.auth); // Get logged-in user details


    const isAdmin = user?.role === "admin"; // Check if the user is an admin

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery({ ...searchQuery, [name]: value });
        if (value === "") {
            dispatch(searchCustomer({})); // Fetch all data when input is cleared
        } else {
            dispatch(searchCustomer({ ...searchQuery, [name]: value }));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(searchCustomer(searchQuery));
    };

    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCustomer(null);
    };

    const handleDeleteCustomer = (customerId) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            dispatch(deleteCustomer(customerId))
                .then(() => {
                    // toast.success("Customer deleted successfully");
                    dispatch(searchCustomer({})); // Refresh customer list
                })
                .catch((err) => toast.error("Failed to delete customer"));
        }
    };

    // const handleUpdateCustomer = (customer) => {
    //     const updatedData = { ...customer, companyName: prompt("Enter new company name:", customer.companyName) };
    //     if (updatedData.companyName !== customer.companyName) {
    //         dispatch(updateCustomer(customer._id, updatedData))
    //             .then(() => {
    //                 toast.success("Customer updated successfully");
    //                 dispatch(searchCustomer({})); // Refresh customer list
    //             })
    //             .catch((err) => toast.error("Failed to update customer"));
    //     }
    // };

    const handleUpdateCustomer = (customer) => {
        setSelectedCustomer(customer);
        setShowUpdateModal(true); // Open update modal
    };

    useEffect(() => {
        dispatch(searchCustomer({})); // Fetch all data on initial load
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <Container className="client-list-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="title">Customer List</h2>

            {/* Search Form */}
            <Form onSubmit={handleSearch} className="search-form">
                <Row className="align-items-end">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="companyName"
                                value={searchQuery.companyName}
                                onChange={handleChange}
                                placeholder="Search by company name"
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Contact Person</Form.Label>
                            <Form.Control
                                type="text"
                                name="contactPerson"
                                value={searchQuery.contactPerson}
                                onChange={handleChange}
                                placeholder="Search by contact person"
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="mobileNumber"
                                value={searchQuery.mobileNumber}
                                onChange={handleChange}
                                placeholder="Search by mobile number"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Tally Serial Number</Form.Label>
                            <Form.Control
                                type="number"
                                name="tallySerialNo"
                                value={searchQuery.tallySerialNo}
                                onChange={handleChange}
                                placeholder="Search by Tally Serial Number"
                            />
                        </Form.Group>
                    </Col>

                    <Col md={12} className="text-center mt-3">
                        <Button type="submit" variant="primary" disabled={loading} className="search-btn">
                            {loading ? <Spinner animation="border" size="sm" /> : "Search"}
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* Customer Table */}
            {customers?.length > 0 ? (
                <div className="table-responsive">
                    <Table className="customer-table">
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Contact Person</th>
                                <th>Mobile Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer._id}>
                                    <td>{customer.companyName}</td>
                                    <td>{customer.contactPerson}</td>
                                    <td>{customer.mobileNumber}</td>
                                    <td>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            className="m-1 view-btn"
                                            onClick={() => handleViewDetails(customer)}
                                        >
                                            View
                                        </Button>
                                        {isAdmin && (
                                            <>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="m-1"
                                                    onClick={() => handleUpdateCustomer(customer)}
                                                >
                                                    Update
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="m-1"
                                                    onClick={() => handleDeleteCustomer(customer._id)}
                                                >
                                                    Delete
                                                </Button>
                                                {/* <Button
                                                    disabled={loading}
                                                    id={customer._id}
                                                    variant="danger"
                                                    size="sm"
                                                    className="m-1"
                                                    onClick={() => handleDeleteCustomer(customer._id)}
                                                >
                                                    {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
                                                </Button> */}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <div className="no-results">No customers found matching the search criteria.</div>
            )}

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <CustomerDetailModal show={showModal} onHide={handleCloseModal} customer={selectedCustomer} />
            )}
            {/* Update Customer Modal */}
            {selectedCustomer && (
                <UpdateCustomerModal
                    show={showUpdateModal}
                    handleClose={() => setShowUpdateModal(false)}
                    customerData={selectedCustomer}
                />
            )}
        </Container>
    );
};

export default ClientList;



