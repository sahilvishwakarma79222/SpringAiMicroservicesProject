// "use client";
// import { Nav, Button, Card } from "react-bootstrap";
// import { 
//   FaTachometerAlt, 
//   FaUsers, 
//   FaProjectDiagram, 
//   FaTasks, 
//   FaCalendarAlt,
//   FaChartBar,
//   FaCog,
//   FaSignOutAlt,
//   FaHome
// } from "react-icons/fa";
// import { useRouter, usePathname } from "next/navigation";

// export default function AppSidebar() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const menuItems = [
//     { path: "/", label: "Dashboard", icon: FaTachometerAlt },
//     { path: "/employees", label: "Employees", icon: FaUsers },
//     { path: "/projects", label: "Projects", icon: FaProjectDiagram },
//     { path: "/tasks", label: "Tasks", icon: FaTasks },
//     { path: "/calendar", label: "Calendar", icon: FaCalendarAlt },
//     { path: "/reports", label: "Reports", icon: FaChartBar },
//     { path: "/settings", label: "Settings", icon: FaCog },
//   ];

//   const isActive = (path) => pathname === path;

//   return (
//     <div className="bg-dark text-white vh-100 d-flex flex-column" style={{ width: "280px" }}>
//       {/* Logo */}
//       <div className="p-4 border-bottom border-secondary">
//         <div className="d-flex align-items-center gap-2">
//           <div className="bg-primary rounded p-2">
//             <FaHome className="text-white" size={20} />
//           </div>
//           <div>
//             <h5 className="mb-0 text-white fw-bold">TaskFlow Pro</h5>
//             <small className="text-muted">Management System</small>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Menu */}
//       <Nav className="flex-column p-3 flex-grow-1">
//         {menuItems.map((item) => (
//           <Nav.Link
//             key={item.path}
//             href={item.path}
//             className={`d-flex align-items-center gap-3 py-3 px-3 rounded mb-1 text-decoration-none ${
//               isActive(item.path) 
//                 ? "bg-primary text-white" 
//                 : "text-light hover-bg-light hover-text-dark"
//             }`}
//             onClick={(e) => {
//               e.preventDefault();
//               router.push(item.path);
//             }}
//           >
//             <item.icon size={18} />
//             <span className="fw-medium">{item.label}</span>
//             {isActive(item.path) && (
//               <div className="ms-auto">
//                 <div className="bg-white rounded" style={{ width: "4px", height: "20px" }}></div>
//               </div>
//             )}
//           </Nav.Link>
//         ))}
//       </Nav>

//       {/* Bottom Section - Quick Stats & Logout */}
//       <div className="p-3 border-top border-secondary">
//         {/* Quick Stats Card */}
//         <Card className="bg-secondary border-0 mb-3">
//           <Card.Body className="p-3">
//             <div className="d-flex justify-content-between align-items-center text-white">
//               <div>
//                 <small className="text-light">Today's Tasks</small>
//                 <h6 className="mb-0 fw-bold">12/24</h6>
//               </div>
//               <div className="bg-warning rounded p-2">
//                 <FaTasks className="text-dark" size={16} />
//               </div>
//             </div>
//           </Card.Body>
//         </Card>

//         {/* Logout Button */}
//         <Button 
//           variant="outline-light" 
//           className="w-100 d-flex align-items-center justify-content-center gap-2"
//           onClick={() => {
//             // Add logout logic here
//             console.log("Logging out...");
//           }}
//         >
//           <FaSignOutAlt />
//           Logout
//         </Button>

//         {/* Footer Info */}
//         <div className="text-center mt-3">
//           <small className="text-muted">v2.1.0 • © 2024</small>
//         </div>
//       </div>
//     </div>
//   );
// }


// components/AppSidebar.js
"use client";
import { Nav, Button, Card } from "react-bootstrap";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaProjectDiagram, 
  FaTasks, 
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";

export default function AppSidebar({ isCollapsed }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: FaTachometerAlt },
    { path: "/employees", label: "Employees", icon: FaUsers },
    { path: "/projects", label: "Projects", icon: FaProjectDiagram },
    { path: "/tasks", label: "Tasks", icon: FaTasks },
    { path: "/calendar", label: "Calendar", icon: FaCalendarAlt },
    { path: "/reports", label: "Reports", icon: FaChartBar },
    { path: "/settings", label: "Settings", icon: FaCog },
  ];

  const isActive = (path) => pathname === path;

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
          {menuItems.map((item) => (
            <Nav.Link
              key={item.path}
              href={item.path}
              className={`d-flex align-items-center rounded mb-1 text-decoration-none ${
                isActive(item.path) 
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
              <item.icon size={16} className={isCollapsed ? '' : 'me-3'} />
              {!isCollapsed && (
                <span className="fw-medium">{item.label}</span>
              )}
            </Nav.Link>
          ))}
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
                  <small className="text-light" style={{ fontSize: '0.75rem' }}>Today's Tasks</small>
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>12/24</h6>
                </div>
                <div className="bg-warning rounded p-1">
                  <FaTasks className="text-dark" size={12} />
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