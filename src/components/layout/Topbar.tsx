import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { Avatar } from '../ui/Avatar';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  ChevronRight,
  Shield,
  ExternalLink,
  Database
} from 'lucide-react';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const { open: openCommandPalette } = useCommandPalette();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Parse path breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const url = `/${pathParts.slice(0, index + 1).join('/')}`;
    const name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    return { name, url, isLast: index === pathParts.length - 1 };
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#05070A]/85 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/[0.06] lg:hidden shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-text-muted truncate">
          <Link
            to="/dashboard"
            className="hover:text-text-primary transition-colors font-medium shrink-0"
          >
            MediCore
          </Link>
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.url}>
              <ChevronRight className="w-3.5 h-3.5 text-text-muted/50 shrink-0" />
              {crumb.isLast ? (
                <span className="font-semibold text-text-primary truncate">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.url}
                  className="hover:text-text-primary transition-colors truncate"
                >
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Search, Emergency indicator, Notifications, User profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Command Palette Trigger */}
        <button
          onClick={openCommandPalette}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.06] text-xs text-text-muted transition-all text-left"
          title="Global Search (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-text-secondary">Search or jump to...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-text-muted bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/[0.08]">
            Ctrl K
          </kbd>
        </button>

        {/* Live Database & Backend Status */}
        <div 
          className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-status-success/10 border border-status-success/25 text-status-success text-xs font-medium select-none"
          title="PostgreSQL 16 & Spring Boot 3.4.3 connected"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
          </span>
          <Database className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold tracking-wide">Live DB Active</span>
        </div>

        {/* Emergency Alert Indicator */}
        <Link
          to="/emergency"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-status-danger/10 border border-status-danger/25 text-status-danger text-xs font-semibold hover:bg-status-danger/15 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-status-danger animate-ping" />
          <span>ER Triage</span>
        </Link>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-danger ring-2 ring-[#05070A]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0F131A] border border-white/[0.12] shadow-glass p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.08] mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-status-danger/20 text-status-danger">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-[11px] font-medium text-accent-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1.5">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.actionUrl) {
                        navigate(n.actionUrl);
                        setShowNotifications(false);
                      }
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-transparent hover:bg-white/[0.03]'
                        : 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-text-muted mb-0.5">
                      <span className="font-semibold text-text-primary">{n.title}</span>
                      <span>{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-white/[0.08] text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-accent-primary hover:underline font-medium"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <Avatar name={user?.name || 'Admin'} size="sm" />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-text-primary leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-accent-primary leading-tight">
                {user?.role || 'Super Admin'}
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0F131A] border border-white/[0.12] shadow-glass p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                <p className="text-xs font-semibold text-text-primary">{user?.name}</p>
                <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-status-success">
                  <Shield className="w-3 h-3" />
                  <span>{user?.role}</span>
                </div>
              </div>
              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.05]"
              >
                <span>Hospital Settings</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-status-danger hover:bg-status-danger/10 transition-colors mt-1 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
