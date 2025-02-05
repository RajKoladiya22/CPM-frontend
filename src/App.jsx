import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import GenerateCode from "./components/GenerateCode";
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
// import Profile from "./components/Profile";
// import EmployeeList from "./components/EmployeeList";
import PrivateRoute from "./utils/PrivateRoute";

function Layout() {
  const location = useLocation();

  // Hide Sidebar on login and register pages
  const hideSidebar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="d-flex ">
      {!hideSidebar && <Sidebar />} {/* Sidebar will not show on login/register */}
      <div className="main-content flex-grow-1 p-3" style={{ marginTop: "65px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addRegister" element={<PrivateRoute element={<Register />} allowedRoles={[ "admin","superadmin"]} />} />
          <Route path="/generateCode" element={<PrivateRoute element={<GenerateCode />} allowedRoles={["admin", "superadmin"]} />} />
          <Route path="/clientform" element={<PrivateRoute element={<ClientForm />} allowedRoles={["admin", "superadmin"]} />} />
          <Route path="/client" element={<PrivateRoute element={<ClientList />} allowedRoles={["user", "admin", "superadmin"]} />} />

          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          {/* <Route path="/profile" element={<Profile />} />
            <Route path="/employee" element={<EmployeeList />} />  */}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </>
  );
}

export default App;
