import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { EmergencyBroadcastBanner } from '../emergency/EmergencyBroadcastBanner';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#05070A] bg-ambient-radial text-text-primary flex flex-col">
      {/* Hospital-Wide Emergency Broadcast Banner */}
      <EmergencyBroadcastBanner />

      <div className="flex-1 flex">
        {/* Sidebar (Desktop fixed ~260px, Mobile drawer) */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />
    </div>
  );
};
