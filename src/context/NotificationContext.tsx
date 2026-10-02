import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationItem } from '../types/system';
import { operationsService } from '../services/operationsService';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

interface NotificationContextType {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type'], title?: string) => void;
  removeToast: (id: string) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => Promise<void>;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp'>) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Web Audio API subtle crystal hospital notification chime
const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio policy errors
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifs = async () => {
    try {
      const items = await operationsService.getNotifications();
      setNotifications(items);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const showToast = (message: string, type: Toast['type'] = 'success', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, title };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAsRead = async (id: string) => {
    await operationsService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    await operationsService.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info', 'Notifications');
  };

  const addNotification = async (item: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const created = await operationsService.addNotification(item);
    setNotifications(prev => [created, ...prev]);
    playNotificationChime();
    showToast(
      created.message,
      created.priority === 'High' ? 'warning' : 'info',
      created.title
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        refreshNotifications: fetchNotifs,
      }}
    >
      {children}
      {/* Toast container overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-glass transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-[#0F131A]/95 border-[#30D158]/30 text-white'
                : toast.type === 'error'
                ? 'bg-[#0F131A]/95 border-[#FF5C70]/30 text-white'
                : toast.type === 'warning'
                ? 'bg-[#0F131A]/95 border-[#FFB547]/30 text-white'
                : 'bg-[#0F131A]/95 border-[#5B8CFF]/30 text-white'
            }`}
          >
            <div className="mt-0.5">
              {toast.type === 'success' && <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#30D158] ring-4 ring-[#30D158]/20" />}
              {toast.type === 'error' && <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF5C70] ring-4 ring-[#FF5C70]/20" />}
              {toast.type === 'warning' && <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FFB547] ring-4 ring-[#FFB547]/20" />}
              {toast.type === 'info' && <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#5B8CFF] ring-4 ring-[#5B8CFF]/20" />}
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && <div className="text-xs font-semibold tracking-wide uppercase text-text-muted mb-0.5">{toast.title}</div>}
              <div className="text-sm text-text-primary font-medium">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-primary transition-colors text-xs p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
