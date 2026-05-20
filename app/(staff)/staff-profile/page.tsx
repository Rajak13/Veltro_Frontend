"use client";

import PageHeader from "@/components/layout/PageHeader";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Shield, User } from "lucide-react";

export default function StaffProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Account details and security"
        breadcrumb={[{ label: "Staff" }, { label: "Profile" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Account card */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-orange-500" />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                <User className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">{user?.name ?? "Staff"}</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-100 mt-1">
                  Staff
                </span>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Email</p>
                  <p className="text-sm text-zinc-800 font-medium">{user?.email ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Role</p>
                  <p className="text-sm text-zinc-800 font-medium">Staff — Sales &amp; service</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change password card */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-orange-500" />
          <div className="p-6">
            <h2 className="text-base font-semibold text-zinc-900 mb-1">Change password</h2>
            <p className="text-sm text-zinc-500 mb-5">
              Update your login password. You will need your current password to confirm.
            </p>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
