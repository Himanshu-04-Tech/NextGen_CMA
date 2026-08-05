import React, { useState } from 'react';
import Sidebar from '../navigation/Sidebar.jsx';
import Topbar from './Topbar.jsx';

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-screen overflow-hidden bg-brand-dark text-white flex">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-brand-purple/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-brand-gold/[0.02] blur-[100px]" />
      </div>

      {/* Collapsible Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <Topbar />
        
        {/* Content container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
