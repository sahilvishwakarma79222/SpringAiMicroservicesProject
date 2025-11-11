// "use client";
// import { Navbar, Container, Form, InputGroup, Dropdown, Image } from "react-bootstrap";
// import { FaSearch, FaBell, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";

// export default function AppNavbar() {
//   return (
//     <Navbar bg="white" expand="lg" className="shadow-sm border-bottom sticky-top">
//       <Container fluid className="px-4">
//         {/* Brand */}
//         <Navbar.Brand className="fw-bold fs-4 text-primary">
//           🚀 TaskFlow Pro
//         </Navbar.Brand>

//         {/* Search Bar */}
//         <div className="mx-auto" style={{ width: "400px" }}>
//           <InputGroup>
//             <Form.Control
//               placeholder="Search employees, projects, tasks..."
//               className="border-end-0"
//             />
//             <InputGroup.Text className="bg-white border-start-0">
//               <FaSearch className="text-muted" />
//             </InputGroup.Text>
//           </InputGroup>
//         </div>

//         {/* Right Side Icons */}
//         <div className="d-flex align-items-center gap-3">
//           {/* Notification Bell */}
//           <div className="position-relative">
//             <FaBell size={20} className="text-muted cursor-pointer" />
//             <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//               3
//             </span>
//           </div>

//           {/* Admin Profile Dropdown */}
//           <Dropdown align="end">
//             <Dropdown.Toggle 
//               variant="light" 
//               id="dropdown-basic"
//               className="border-0 d-flex align-items-center gap-2"
//             >
//               <div className="d-flex align-items-center gap-2">
//                 <Image
//                   src="/api/placeholder/32/32"
//                   roundedCircle
//                   width={32}
//                   height={32}
//                   className="border"
//                   alt="Admin"
//                 />
//                 <div className="d-none d-md-block text-start">
//                   <div className="fw-semibold text-dark">Admin User</div>
//                   <small className="text-muted">Administrator</small>
//                 </div>
//               </div>
//             </Dropdown.Toggle>

//             <Dropdown.Menu className="shadow border-0 mt-2">
//               <Dropdown.Item href="#profile" className="d-flex align-items-center gap-2">
//                 <FaUserCircle className="text-primary" />
//                 My Profile
//               </Dropdown.Item>
//               <Dropdown.Item href="#settings" className="d-flex align-items-center gap-2">
//                 <FaCog className="text-secondary" />
//                 Settings
//               </Dropdown.Item>
//               <Dropdown.Divider />
//               <Dropdown.Item href="#logout" className="d-flex align-items-center gap-2 text-danger">
//                 <FaSignOutAlt />
//                 Logout
//               </Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>
//       </Container>
//     </Navbar>
//   );
// }


// components/Navbar.js
"use client";
import { Navbar, Container, Form, InputGroup, Dropdown } from "react-bootstrap";
import { FaSearch, FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaChevronRight, FaChevronLeft, FaTasks } from "react-icons/fa";

export default function AppNavbar({ onToggleSidebar, isSidebarCollapsed }) {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom" style={{ minHeight: '60px' }}>
      <Container fluid className="px-3">
        {/* Logo with Arrow Toggle - Left Side */}
        <div className="d-flex align-items-center">
          {/* Logo */}
          <div className="d-flex align-items-center">
            <FaTasks className="text-primary me-2" size={20} />
            <span className="fw-bold text-dark" style={{ fontSize: '1rem' }}>Task Management</span>
          </div>
          
          {/* Arrow Toggle Button - Right after Logo */}
          <button
            className="btn border-0 bg-transparent ms-3 d-flex align-items-center justify-content-center"
            onClick={onToggleSidebar}
            style={{ 
              width: '32px', 
              height: '32px',
              borderRadius: '6px',
              transition: 'all 0.3s ease'
            }}
            title={isSidebarCollapsed ? "Open Sidebar" : "Close Sidebar"}
          >
            {isSidebarCollapsed ? (
              <FaChevronRight className="text-dark" size={14} />
            ) : (
              <FaChevronLeft className="text-dark" size={14} />
            )}
          </button>
        </div>

        {/* Search Bar - Compact */}
        <div className="mx-auto" style={{ width: "300px" }}>
          <InputGroup>
            <Form.Control
              placeholder="Search..."
              className="border-end-0 py-2"
              style={{ fontSize: '0.8rem' }}
            />
            <InputGroup.Text className="bg-white border-start-0 py-2">
              <FaSearch className="text-muted" size={12} />
            </InputGroup.Text>
          </InputGroup>
        </div>

        {/* Right Side Icons - Compact */}
        <div className="d-flex align-items-center gap-2">
          {/* Notification Bell */}
          <div className="position-relative">
            <button className="btn border-0 bg-transparent position-relative p-1">
              <FaBell size={16} className="text-dark" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.5rem', padding: '1px 3px' }}>
                3
              </span>
            </button>
          </div>

          {/* Admin Profile Dropdown - Compact */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="border-0 d-flex align-items-center gap-1 bg-transparent p-1"
            >
              <div className="d-flex align-items-center gap-1">
                <div
                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                >
                  AU
                </div>
                <div className="d-none d-lg-block text-start ms-1">
                  <div className="fw-semibold text-dark" style={{ fontSize: '0.8rem' }}>Admin</div>
                  <small className="text-muted" style={{ fontSize: '0.65rem' }}>Admin</small>
                </div>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow border-0 mt-2" style={{ fontSize: '0.8rem' }}>
              <Dropdown.Item href="#profile" className="d-flex align-items-center gap-2 py-2">
                <FaUserCircle className="text-primary" size={14} />
                My Profile
              </Dropdown.Item>
              <Dropdown.Item href="#settings" className="d-flex align-items-center gap-2 py-2">
                <FaCog className="text-secondary" size={14} />
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#logout" className="d-flex align-items-center gap-2 py-2 text-danger">
                <FaSignOutAlt size={14} />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
}