// components/MainLayout.js (No changes needed)
"use client";
import AppNavbar from "./Navbar";
import AppSidebar from "./AppSidebar";
import { useState, useEffect } from "react";

export default function MainLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div style={{ position: 'sticky', top: 0, zIndex: 1030 }}>
        <AppNavbar 
          onToggleSidebar={toggleSidebar} 
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
      
      <div className="d-flex flex-grow-1 position-relative">
        <div style={{ 
          position: 'fixed', 
          top: 10, 
          left: 0, 
          zIndex: 1020,
          height: '100vh'
        }}>
          <AppSidebar isCollapsed={isSidebarCollapsed} />
        </div>
        
        <main 
          className="flex-grow-1 bg-light position-relative"
          style={{ 
            marginLeft: isSidebarCollapsed ? '60px' : '240px',
            transition: 'margin-left 0.3s ease',
            overflowY: 'auto',
            height: 'calc(100vh - 56px)',
            minHeight: 'calc(100vh - 56px)',
            zIndex: 1
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}