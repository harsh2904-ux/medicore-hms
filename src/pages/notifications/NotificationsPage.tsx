import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { NotificationItem } from '../../types/system';
import { GlassCard } from '../../components/ui/GlassCard';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Stethoscope,
  Receipt,
  Pill,
  Shield,
  ArrowRight,
  Plus,
  Send,
  AlertTriangle,
  Info
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useNotification();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  // New notification form state
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCategory, setNewCategory] = useState<NotificationItem['category']>('Clinical');
  const [newPriority, setNewPriority] = useState<NotificationItem['priority']>('Normal');
  const [isSending, setIsSending] = useState(false);

  const filteredNotifications = activeCategory === 'All'
    ? notifications
    : notifications.filter(n => n.category === activeCategory);

  const tabs = [
    { id: 'All', label: 'All Alerts', badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'Clinical', label: 'Clinical' },
    { id: 'Appointments', label: 'Appointments' },
    { id: 'Billing', label: 'Billing' },
    { id: 'Pharmacy', label: 'Pharmacy' },
    { id: 'System', label: 'System' },
  ];

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'Clinical':
        return <Stethoscope className="w-4 h-4 text-status-danger" />;
      case 'Appointments':
        return <Calendar className="w-4 h-4 text-status-warning" />;
      case 'Billing':
        return <Receipt className="w-4 h-4 text-status-success" />;
      case 'Pharmacy':
        return <Pill className="w-4 h-4 text-accent-secondary" />;
      case 'System':
        return <Shield className="w-4 h-4 text-accent-primary" />;
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    setIsSending(true);
    try {
      await addNotification({
        title: newTitle.trim(),
        message: newMessage.trim(),
        category: newCategory,
        priority: newPriority,
        read: false,
        actionUrl: newCategory === 'Clinical' ? '/opd/consultation' : (newCategory === 'Appointments' ? '/appointments' : '/dashboard'),
      });
      setIsSendModalOpen(false);
      setNewTitle('');
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Operational alerts, critical clinical values, pharmacy stock reminders, and appointments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSendModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Dispatch Live Alert
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-status-success" />}
          >
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeCategory} onChange={setActiveCategory} />

      {/* Notifications list */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <GlassCard className="p-8 text-center text-text-muted">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-400" />
            <p className="font-semibold text-text-primary text-sm">No notifications in this category</p>
            <p className="text-xs text-text-secondary mt-1">All hospital alerts and operational tasks are up to date.</p>
          </GlassCard>
        ) : (
          filteredNotifications.map(notif => (
            <GlassCard
              key={notif.id}
              onClick={() => {
                markAsRead(notif.id);
                if (notif.actionUrl) navigate(notif.actionUrl);
              }}
              className={`p-4 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                notif.read ? 'opacity-70 hover:opacity-100' : 'border-blue-500/30 bg-blue-500/[0.03]'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0 mt-0.5">
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-text-primary">{notif.title}</span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/[0.06] text-text-muted">
                      {notif.category}
                    </span>
                    {notif.priority === 'High' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-status-danger/15 text-status-danger border border-status-danger/30">
                        Critical
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">{notif.message}</p>
                  <p className="text-[11px] text-text-muted">{notif.timestamp}</p>
                </div>
              </div>

              {notif.actionUrl && (
                <div className="text-accent-primary hover:text-accent-primary/80 shrink-0 self-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </GlassCard>
          ))
        )}
      </div>

      {/* Dispatch New Alert Modal */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Dispatch Hospital Live Alert"
        subtitle="Broadcast an operational notification across MediCore HMS"
        maxWidth="md"
      >
        <form onSubmit={handleSendNotification} className="space-y-4">
          <Input
            label="Alert Title"
            placeholder="e.g. STAT Lab Results or Emergency Notice"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            required
          />

          <Textarea
            label="Notification Message"
            placeholder="Detailed alert description or instructions for hospital personnel..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            rows={3}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Category
              </label>
              <Select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                options={[
                  { label: 'Clinical', value: 'Clinical' },
                  { label: 'Appointments', value: 'Appointments' },
                  { label: 'Billing', value: 'Billing' },
                  { label: 'Pharmacy', value: 'Pharmacy' },
                  { label: 'System', value: 'System' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Priority
              </label>
              <Select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as any)}
                options={[
                  { label: 'Normal Priority', value: 'Normal' },
                  { label: 'High / Critical', value: 'High' },
                  { label: 'Low', value: 'Low' },
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSendModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSending}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Dispatch Notification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
