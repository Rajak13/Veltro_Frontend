"use client";

import { Bell, CheckCheck, Info, Package, CreditCard } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { useNotifications, useMarkNotificationRead, type NotificationItem } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const unread = notifications.filter((n) => !n.isRead);

  function markAllRead() {
    unread.forEach((n) => markRead(n.notificationId));
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Stay up to date with your appointments and account activity"
        breadcrumb={[{ label: "Account" }, { label: "Notifications" }]}
        action={
          unread.length > 0 ? (
            <Button variant="outline" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </Button>
          ) : undefined
        }
      />

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="md" className="text-orange-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="w-10 h-10 text-zinc-200 mb-3" />
            <p className="text-sm font-medium text-zinc-500">No notifications yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              We&apos;ll notify you when your appointments are confirmed or updated.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-50">
            {notifications.map((n) => (
              <NotificationRow key={n.notificationId} item={n} onMarkRead={markRead} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function NotificationRow({
  item,
  onMarkRead,
}: {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
}) {
  const iconMap = {
    LowStock:      { icon: Package,    bg: "bg-orange-50",  color: "text-orange-500" },
    CreditOverdue: { icon: CreditCard, bg: "bg-red-50",     color: "text-red-500"    },
    General:       { icon: Info,       bg: "bg-blue-50",    color: "text-blue-500"   },
  };
  const { icon: Icon, bg, color } = iconMap[item.type] ?? iconMap.General;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <li
      className={cn(
        "flex items-start gap-4 px-5 py-4 transition-colors",
        item.isRead ? "opacity-60" : "bg-orange-50/30 hover:bg-orange-50/50"
      )}
    >
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", bg)}>
        <Icon className={cn("w-4 h-4", color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-zinc-700 leading-relaxed">{item.message}</p>
        <p className="text-[11px] text-zinc-400 mt-1">{timeAgo(item.createdAt)}</p>
      </div>
      {!item.isRead && (
        <button
          onClick={() => onMarkRead(item.notificationId)}
          title="Mark as read"
          className="flex-shrink-0 flex items-center gap-1 text-[11px] text-zinc-400 hover:text-orange-600 transition-colors mt-0.5"
        >
          <CheckCheck className="w-3.5 h-3.5" />
        </button>
      )}
    </li>
  );
}
