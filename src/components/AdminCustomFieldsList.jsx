import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomFields, deleteField } from "../redux/actions/customerActions";
import { Table, Pagination, Spinner, Alert, Button } from "react-bootstrap";
import AddCustomFieldButton from "./AddCustomFieldButton";
import UpdateCustomFieldModal from "./UpdatingCustomFields";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminCustomFieldsList = () => {
    const dispatch = useDispatch();
    const { loading, customFields, error } = useSelector((state) => state.customField);
    const [selectedField, setSelectedField] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items per page

    useEffect(() => {
        dispatch(getCustomFields());
    }, [dispatch]);

    useEffect(() => {
        // Ensure the current page is valid after deleting a field
        if (customFields.length && currentPage > Math.ceil(customFields.length / itemsPerPage)) {
            setCurrentPage(Math.max(1, Math.ceil(customFields.length / itemsPerPage)));
        }
    }, [customFields, currentPage]);

    // Calculate the displayed fields
    const indexOfLastField = currentPage * itemsPerPage;
    const indexOfFirstField = indexOfLastField - itemsPerPage;
    const currentFields = customFields.slice(indexOfFirstField, indexOfLastField);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteField = (fieldId) => {
        if (window.confirm("Are you sure you want to delete this Field?")) {
            dispatch(deleteField(fieldId))
                .then(() => {
                    dispatch(getCustomFields()); // Refresh Field list
                    toast.success("Field deleted successfully!");
                })
                .catch(() => {
                    toast.error("Failed to delete field.");
                });
        }
    };

    const handleUpdateField = (field) => {
        setSelectedField(field);
        setShowUpdateModal(true);
    };

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h3>Admin Custom Fields</h3>
                <AddCustomFieldButton />
            </div>

            {/* Show Error */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Show Loader */}
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Field Name</th>
                                <th>Field Type</th>
                                <th>Required</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentFields.map((field, index) => (
                                <tr key={field._id}>
                                    <td>{indexOfFirstField + index + 1}</td>
                                    <td>{field.fieldName}</td>
                                    <td>{field.fieldType}</td>
                                    <td>{field.isRequired ? "Yes" : "No"}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="m-1"
                                            onClick={() => handleUpdateField(field)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="m-1"
                                            onClick={() => handleDeleteField(field._id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <Pagination>
                        {Array.from({ length: Math.ceil(customFields.length / itemsPerPage) }, (_, index) => (
                            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </>
            )}
            
            {/* Update Modal */}
            {selectedField && (
                <UpdateCustomFieldModal
                    fieldToEdit={selectedField}
                    show={showUpdateModal}
                    handleClose={() => setShowUpdateModal(false)}
                />
            )}
        </div>
    );
};

export default AdminCustomFieldsList;
