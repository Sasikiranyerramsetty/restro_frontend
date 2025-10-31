import React, { useState } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, backgroundImage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapseChange = (isCollapsed) => {
    setSidebarCollapsed(isCollapsed);
  };

  const rootClass = backgroundImage ? 'min-h-screen relative' : 'min-h-screen';

  // Helper to get the image URL
  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    // Handle require() return value - it could be the path directly or in .default
    return img.default || img;
  };

  const imageUrl = getImageUrl(backgroundImage);

  return (
    <div 
      className={rootClass}
      style={!backgroundImage ? { backgroundColor: '#F1FAEE' } : undefined}
    >
      {/* Background Image */}
      {imageUrl && (
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${imageUrl})`,
            zIndex: 0
          }}
        />
      )}
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        onCollapseChange={handleSidebarCollapseChange}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out relative z-10 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Page Content */}
        <main className="px-4 py-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
