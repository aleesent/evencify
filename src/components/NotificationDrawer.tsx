import React, { useState } from 'react';
import { AppNotification } from '../types';
import { X, CheckCheck, Bell, UserCheck, Calendar, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onSelectNotification: (item: AppNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
}) => {
  const [filter, setFilter] = useState<'all' | 'application' | 'event' | 'payment'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => (filter === 'all' ? true : n.type === filter));

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'application':
        return <UserCheck className="h-4 w-4 text-black" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-black" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-black" />;
      default:
        return <Bell className="h-4 w-4 text-black" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 flex h-full w-full max-w-md flex-col border-l-2 border-black bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-black px-6 py-5 bg-[#FED000]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-[#FED000] border border-black">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-black">Notifications</h3>
                <p className="text-xs font-bold text-black">Live event activity updates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-black hover:bg-black/10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between border-b-2 border-black/15 px-6 py-2.5 bg-[#FFFDE6]">
            <div className="flex gap-1">
              {(['all', 'application', 'event', 'payment'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-black capitalize transition-colors cursor-pointer ${
                    filter === t
                      ? 'bg-black text-[#FED000]'
                      : 'text-black hover:bg-black/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs font-black text-black hover:underline cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5 text-black" />
              <span>Mark read</span>
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y border-black/10 p-4 space-y-2">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm font-bold text-black">
                No notifications right now.
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectNotification(item)}
                  className={`cursor-pointer rounded-2xl p-3.5 transition-colors border-2 ${
                    item.read
                      ? 'bg-white border-black/20 hover:border-black text-black'
                      : 'bg-[#FFFDE6] border-black text-black font-medium'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-[#FED000] p-2 border border-black shadow-xs">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-black truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold text-black shrink-0">{item.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-black font-semibold leading-relaxed line-clamp-2">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
