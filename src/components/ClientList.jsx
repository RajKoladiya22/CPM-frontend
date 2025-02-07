import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomer, deleteCustomer } from "../redux/actions/customerActions";
import { Table, Row, Col, Form, Button, Spinner, Container, Pagination } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerDetailModal from "./CustomerDetailModal";
import UpdateCustomerModal from "./updateModel";
import "../assets/css/index.css";

const ClientList = () => {
    const [searchQuery, setSearchQuery] = useState({
        companyName: "",
        mobileNumber: "",
        contactPerson: "",
        tallySerialNo: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const limit = 10;
    const dispatch = useDispatch();
    const { customers, loading, error, pagination } = useSelector(state => state.customer);
    const { user } = useSelector(state => state.auth);
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        dispatch(searchCustomer({}, currentPage, limit));
    }, [dispatch, currentPage]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
            dispatch(searchCustomer(searchQuery, newPage, limit));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchQuery(prev => ({ ...prev, [name]: value }));
        dispatch(searchCustomer({ ...searchQuery, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        dispatch(searchCustomer(searchQuery, 1, limit));
    };

    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const handleDeleteCustomer = (customerId) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            dispatch(deleteCustomer(customerId))
                .then(() => dispatch(searchCustomer({})))
                .catch(() => toast.error("Failed to delete customer"));
        }
    };

    const handleUpdateCustomer = (customer) => {
        setSelectedCustomer(customer);
        setShowUpdateModal(true);
    };

    return (
        <Container className="client-list-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="title">Customer List</h2>

            <Form onSubmit={handleSearch} className="search-form">
                <Row className="align-items-end">
                    {['companyName', 'contactPerson', 'mobileNumber', 'tallySerialNo'].map(field => (
                        <Col md={3} key={field}>
                            <Form.Group>
                                <Form.Label>{field.replace(/([A-Z])/g, ' $1').trim()}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={field}
                                    value={searchQuery[field]}
                                    onChange={handleChange}
                                    placeholder={`Search by ${field}`}
                                />
                            </Form.Group>
                        </Col>
                    ))}
                    <Col md={12} className="text-center mt-3">
                        <Button type="submit" variant="primary" disabled={loading} className="search-btn">
                            {loading ? <Spinner animation="border" size="sm" /> : "Search"}
                        </Button>
                    </Col>
                </Row>
            </Form>

            {customers?.length > 0 ? (

                <div className="table-responsive">
                    <Table className="customer-table">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Company Name</th>
                                <th>Contact Person</th>
                                <th>Mobile Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {customers.map((customer, index) => {
                                let rowClass = "default-customer"; // Default transparent

                                if (customer.prime) {
                                    rowClass = "prime-customer";
                                } else if (customer.blacklisted) {
                                    rowClass = "blacklisted-customer";
                                }
                                return (

                                    <tr key={customer._id} className={customer.prime ? "prime-customer" : customer.blacklisted ? "blacklisted-customer" : "default-customer"}>
                                        <td className={rowClass}>{(currentPage - 1) * limit + index + 1}</td>
                                        <td className={rowClass}>{customer.companyName}</td>
                                        <td className={rowClass}>{customer.contactPerson}</td>
                                        <td className={rowClass}>{customer.mobileNumber}</td>
                                        <td className={rowClass}>
                                            <Button variant="info" size="sm" className="m-1 view-btn" onClick={() => handleViewDetails(customer)}>View</Button>
                                            {isAdmin && (
                                                <>
                                                    <Button variant="warning" size="sm" className="m-1" onClick={() => handleUpdateCustomer(customer)}>Update</Button>
                                                    <Button variant="danger" size="sm" className="m-1" onClick={() => handleDeleteCustomer(customer._id)}>Delete</Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            ) : <div className="no-results">No customers found.</div>}

            {selectedCustomer && <CustomerDetailModal show={showModal} onHide={() => setShowModal(false)} customer={selectedCustomer} />}
            {selectedCustomer && <UpdateCustomerModal show={showUpdateModal} handleClose={() => setShowUpdateModal(false)} customerData={selectedCustomer} />}

            {/* <div className="pagination-controls text-center mt-3">
                <Button variant="secondary" className="m-1" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <Button variant="secondary" className="m-1" disabled={currentPage === pagination.totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
            </div> */}
            {pagination?.totalPages > 1 && (
                <Pagination className="justify-content-left mt-1">
                    {Array.from({ length: pagination.totalPages }, (_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            )}
        </Container>
    );
};

export default ClientList;
