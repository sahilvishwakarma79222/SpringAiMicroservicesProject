// components/AppSidebar.js
"use client";
import { Nav, Button, Card } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaUsers,
  FaProjectDiagram,
  FaTasks,
  FaSignOutAlt,
  FaCube,
  FaExclamationTriangle
} from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";

export default function AppSidebar({ isCollapsed }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/employees", label: "Employees", icon: FaUsers },
    { path: "/projects", label: "Projects", icon: FaProjectDiagram },
    { path: "/new-module", label: "Module", icon: FaCube },
    { path: "/tasks", label: "Tasks", icon: FaTasks },
    { path: "/errors", label: "Errors", icon: FaExclamationTriangle },
    { path: "/employee-task", label: "Employee Tasks", icon: FaUsers },
    { path: "/project-task", label: "Project Tasks", icon: FaProjectDiagram },
  ];

  const isActive = (path) => pathname === path;

  // Get appropriate icon based on label
  const getIcon = (label, defaultIcon) => {
    const iconMap = {
      "Dashboard": FaTachometerAlt,
      "Employees": FaUsers,
      "Projects": FaProjectDiagram,
      "Module": FaCube,
      "Tasks": FaTasks,
      "Errors": FaExclamationTriangle,
      "Employee Tasks": FaUsers,
      "Project Tasks": FaProjectDiagram,
    };
    return iconMap[label] || defaultIcon;
  };

  return (
    <div
      className={`bg-dark text-white d-flex flex-column ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      style={{
        height: '100vh',
        transition: 'width 0.3s ease',
        paddingTop: '56px', // Navbar height
        overflow: 'hidden'
      }}
    >
      {/* Navigation Menu Only - No Header */}
      <div className="flex-grow-1 overflow-auto py-3">
        <Nav className="flex-column px-2">
          {menuItems.map((item) => {
            const IconComponent = getIcon(item.label, item.icon);
            return (
              <Nav.Link
                key={item.path}
                href={item.path}
                className={`d-flex align-items-center rounded mb-1 text-decoration-none ${isActive(item.path)
                  ? "bg-primary text-white"
                  : "text-light hover-bg-light"
                  } ${isCollapsed ? 'justify-content-center py-2 px-2' : 'justify-content-start py-2 px-3'}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.path);
                }}
                title={isCollapsed ? item.label : ''}
                style={{ fontSize: '0.85rem' }}
              >
                <IconComponent size={16} className={isCollapsed ? '' : 'me-3'} />
                {!isCollapsed && (
                  <span className="fw-medium">{item.label}</span>
                )}
              </Nav.Link>
            );
          })}
        </Nav>
      </div>

      {/* Bottom Section */}
      <div className="p-2 border-top border-secondary">
        {/* Quick Stats - Only when expanded */}
        {!isCollapsed && (
          <Card className="bg-secondary border-0 mb-2">
            <Card.Body className="p-2">
              <div className="d-flex justify-content-between align-items-center text-white">
                <div>
                  <small className="text-light" style={{ fontSize: '0.75rem' }}>Today's Progress</small>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>65% Complete</h6>
                </div>
                <div className="bg-success rounded p-1">
                  <FaTachometerAlt className="text-white" size={12} />
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Logout Button */}
        <Button
          variant="outline-light"
          className={`d-flex align-items-center justify-content-center border-0 bg-transparent ${isCollapsed ? 'px-2 py-2' : 'w-100 py-2'}`}
          onClick={() => console.log("Logging out...")}
          title={isCollapsed ? "Logout" : ""}
          style={{ fontSize: '0.85rem' }}
        >
          <FaSignOutAlt className={isCollapsed ? '' : 'me-2'} size={14} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}