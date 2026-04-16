"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Package, CreditCard, Info, CheckCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications, useMarkNotificationRead, type NotificationItem } from "@/hooks/useNotifications";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const unread = notifications.filter((n) => !n.isRead).length;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleMarkRead(id: string) {
    markRead(id);
  }

  function markAllRead() {
    notifications.filter((n) => !n.isRead).forEach((n) => markRead(n.notificationId));
  }

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-md border-[1.5px] border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:border-zinc-300 transition-all relative"
        aria-label="Notifications"
      >
        <Bell className="w-3.5 h-3.5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-[1.5px] border-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-900/8 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-zinc-900">Notifications</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-semibold rounded-full border border-orange-100">
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-orange-600 transition-colors"
                >
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-zinc-300 hover:text-zinc-500 transition-colors ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell className="w-8 h-8 text-zinc-200 mb-2" />
                <p className="text-[12px] text-zinc-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationRow key={n.notificationId} item={n} onMarkRead={handleMarkRead} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationRow({ item, onMarkRead }: { item: NotificationItem; onMarkRead: (id: string) => void }) {
  const iconMap = {
    LowStock:     { icon: Package,    bg: "bg-orange-50",  color: "text-orange-500" },
    CreditOverdue:{ icon: CreditCard, bg: "bg-red-50",     color: "text-red-500"    },
    General:      { icon: Info,       bg: "bg-blue-50",    color: "text-blue-500"   },
  };
  const { icon: Icon, bg, color } = iconMap[item.type] ?? iconMap.General;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 border-b border-zinc-50 transition-colors",
        item.isRead ? "opacity-60" : "bg-orange-50/30 hover:bg-orange-50/50"
      )}
    >
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", bg)}>
        <Icon className={cn("w-3.5 h-3.5", color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-zinc-700 leading-relaxed">{item.message}</p>
        <p className="text-[10px] text-zinc-400 mt-0.5">{timeAgo(item.createdAt)}</p>
      </div>
      {!item.isRead && (
        <button
          onClick={() => onMarkRead(item.notificationId)}
          className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 hover:bg-orange-400 transition-colors"
          title="Mark as read"
        />
      )}
    </div>
  );
}
