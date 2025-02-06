import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Offcanvas, Button, Container } from "react-bootstrap";
import { FaBars, FaHome, FaUser, FaCode, FaList, FaSignInAlt, FaSignOutAlt, FaRegAddressCard } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import { logoutUser } from "../redux/actions/authActions";
import "../assets/css/sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const location = useLocation(); // Get current route for active link
  const { user } = useSelector(state => state.auth);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <>
      {/* Top Navbar for Small Screens */}
      <Navbar expand="lg" fixed="top" className="d-lg-none shadow-sm d-flex justify-content-around top-navbar">
        <Container className="custom-navbar-container">
          <Button variant="outline-light" onClick={handleShow}>
            <FaBars />
          </Button>
          <Navbar.Brand className="navbar-brand">Dashboard</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Sidebar for Large Screens */}
      <div className="d-none d-lg-flex flex-column sidebar">
        <h4 className="text-center mb-4">Dashboard</h4>
        <Nav className="flex-column">
          <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>
            <FaHome className="me-2" /> Home
          </Nav.Link>
          <Nav.Link as={Link} to="/client" className={location.pathname === "/client" ? "active" : ""}>
            <FaList className="me-2" /> Customer List
          </Nav.Link>
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Nav.Link as={Link} to="/clientform" className={location.pathname === "/clientform" ? "active" : ""}>
              <FaUser className="me-2" /> Add Customer
            </Nav.Link>
          )}
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Nav.Link as={Link} to="/customfield" className={location.pathname === "/customfield" ? "active" : ""}>
              <MdAddCircleOutline className="me-2"/> Custom Form
            </Nav.Link>
          )}
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Nav.Link as={Link} to="/generateCode" className={location.pathname === "/generateCode" ? "active" : ""}>
              <FaCode className="me-2" /> Generate Code
            </Nav.Link>
          )}

          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Nav.Link as={Link} to="/addRegister" className={location.pathname === "/addRegister" ? "active" : ""}>
              <FaRegAddressCard className="me-2" /> Register
            </Nav.Link>
          )}
          <Nav.Link onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </Nav.Link>
        </Nav>
      </div>

      {/* Offcanvas Sidebar for Small Screens */}
      <Offcanvas show={show} onHide={handleClose} className="sidebar-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Dashboard</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>
              <FaHome className="me-2" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/client" className={location.pathname === "/client" ? "active" : ""}>
              <FaList className="me-2" /> Customer List
            </Nav.Link>
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Nav.Link as={Link} to="/clientform" className={location.pathname === "/clientform" ? "active" : ""}>
                <FaUser className="me-2" /> Add Customer
              </Nav.Link>
            )}
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Nav.Link as={Link} to="/customfield" className={location.pathname === "/customfield" ? "active" : ""}>
                <MdAddCircleOutline className="me-2"/> Custom Form
              </Nav.Link>
            )}
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Nav.Link as={Link} to="/generateCode" className={location.pathname === "/generateCode" ? "active" : ""}>
                <FaCode className="me-2" /> Generate Code
              </Nav.Link>
            )}
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Nav.Link as={Link} to="/addRegister" className={location.pathname === "/addRegister" ? "active" : ""}>
                <FaRegAddressCard className="me-2" /> Register
              </Nav.Link>
            )}
            <Nav.Link onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
