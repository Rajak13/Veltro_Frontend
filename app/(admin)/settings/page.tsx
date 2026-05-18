"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { LogOut, Mail, Shield, User } from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const { user, role, logout } = useAuth();

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Account and application preferences"
        breadcrumb={[{ label: "Admin" }, { label: "Settings" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <Card padding="md">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-900">Account</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Name</dt>
              <dd className="font-medium text-zinc-800 text-right">{user?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Email
              </dt>
              <dd className="font-medium text-zinc-800 text-right truncate">{user?.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Role
              </dt>
              <dd className="font-medium text-zinc-800">{role ?? "—"}</dd>
            </div>
          </dl>
          <Button variant="outline" className="w-full mt-5" onClick={logout}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </Card>

        <Card padding="md">
          <h2 className="text-sm font-semibold text-zinc-900 mb-3">Quick links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={ROUTES.ADMIN_PARTS} className="text-orange-600 hover:text-orange-700 font-medium">
                Manage inventory →
              </Link>
            </li>
            <li>
              <Link href={ROUTES.ADMIN_INVENTORY_REPORT} className="text-orange-600 hover:text-orange-700 font-medium">
                Inventory report →
              </Link>
            </li>
            <li>
              <Link href={ROUTES.ADMIN_DASHBOARD} className="text-orange-600 hover:text-orange-700 font-medium">
                Back to dashboard →
              </Link>
            </li>
          </ul>
          <p className="text-[11px] text-zinc-400 mt-4 leading-relaxed">
            System-wide configuration (email SMTP, loyalty rules, stock thresholds) can be extended here in a future release.
          </p>
        </Card>
      </div>
    </div>
  );
}
