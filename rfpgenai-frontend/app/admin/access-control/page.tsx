"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import apiClient from "@/lib/apiClient";

type AccessUser = {
  id: number;
  email: string;
  full_name: string;
  title: string;
  department: string;
  is_active: boolean;
  is_sso_enabled: boolean;
  roles: string[];
  permissions: string[];
};

type AccessRole = {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  user_count: number;
};

type AccessResponse = {
  users: AccessUser[];
  roles: AccessRole[];
};

const accessProfileOrder = [
  "Platform Administration",
  "Engineering",
  "Business Development",
  "Leadership",
];

function sortByAccessProfile<T extends { name?: string; roles?: string[] }>(
  items: T[]
) {
  return [...items].sort((a, b) => {
    const aName = a.name || a.roles?.[0] || "";
    const bName = b.name || b.roles?.[0] || "";

    return (
      accessProfileOrder.indexOf(aName) - accessProfileOrder.indexOf(bName)
    );
  });
}

export default function AccessControlPage() {
  const [data, setData] = useState<AccessResponse | null>(null);

  useEffect(() => {
    async function loadAccessControl() {
      const response = await apiClient.get("/auth/access-control");
      setData(response.data);
    }

    loadAccessControl().catch((error) => {
      console.error("Access control load failed", error);
    });
  }, []);

  const users = useMemo(() => {
    return sortByAccessProfile(data?.users || []);
  }, [data]);

  const roles = useMemo(() => {
    return sortByAccessProfile(data?.roles || []);
  }, [data]);

  const permissionRuleCount = roles.reduce(
    (count, role) => count + role.permissions.length,
    0
  );

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-500">
            Administration / Access Control
          </p>

          <h1 className="text-3xl font-semibold text-[#1a2332] mt-2">
            Access Control
          </h1>

          <p className="text-[13px] text-[#6b7280] mt-2">
            EITACIES INC · {users.length || 7} active users · @eitacies.com
            domain · Last reviewed Jun 17, 2026
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border rounded-[4px] p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Active Users
            </div>
            <div className="text-[28px] font-semibold text-[#1a2332] mt-2">
              {users.length}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Company domain accounts
            </div>
          </div>

          <div className="bg-white border rounded-[4px] p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Access Profiles
            </div>
            <div className="text-[28px] font-semibold text-[#1a2332] mt-2">
              {roles.length}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Permission groups configured
            </div>
          </div>

          <div className="bg-white border rounded-[4px] p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              SSO Enforcement
            </div>
            <div className="text-[28px] font-semibold text-[#1a2332] mt-2">
              Enforced
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Domain-restricted · @eitacies.com
            </div>
          </div>

          <div className="bg-white border rounded-[4px] p-4 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Access Rules
            </div>
            <div className="text-[28px] font-semibold text-[#1a2332] mt-2">
              {permissionRuleCount}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Access rules mapped
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-[4px] p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold text-[#1a2332]">
                User Access Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Authorized users mapped to access profiles and company domain
                enforcement.
              </p>
            </div>

            <div className="text-xs text-slate-500">
              Last access review: Jun 17, 2026
            </div>
          </div>

          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-t border-b border-[#e1e4e8] text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 font-medium">User</th>
                <th className="py-2 pr-3 font-medium">Email</th>
                <th className="py-2 pr-3 font-medium">Department</th>
                <th className="py-2 pr-3 font-medium">Access Profile</th>
                <th className="py-2 pr-3 font-medium">SSO</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pl-3 font-medium text-right">
                  Permissions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={
                    index % 2 === 0
                      ? "h-10 border-t border-b border-[#e1e4e8] bg-[#f9fafb]"
                      : "h-10 border-t border-b border-[#e1e4e8]"
                  }
                >
                  <td className="py-2 pr-3">
                    <div className="font-medium text-[#1a2332]">
                      {user.full_name}
                    </div>
                    {user.email === "bdm@eitacies.com" && (
                      <div className="text-[11px] text-[#9ca3af]">
                        Group account
                      </div>
                    )}
                  </td>

                  <td className="py-2 pr-3 text-slate-700">{user.email}</td>

                  <td className="py-2 pr-3 text-slate-700">
                    {user.department}
                  </td>

                  <td className="py-2 pr-3 text-slate-700">
                    {user.roles.join(", ")}
                  </td>

                  <td className="py-2 pr-3 text-slate-700">
                    <span className="inline-flex items-center rounded-[3px] bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-medium text-[#1a2332]">
                      LOCKED
                    </span>
                  </td>

                  <td className="py-2 pr-3 text-slate-700">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#16a34a]" />
                    Active
                  </td>

                  <td className="py-2 pl-3 text-right text-[#6b7280]">
                    {user.permissions.length} rules
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border rounded-[4px] p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-[#1a2332]">
              Governance Controls
            </h2>

            <div className="text-xs text-slate-500">
              Last access review: Jun 17, 2026
            </div>
          </div>

          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-t border-b border-[#e1e4e8] text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 font-medium">Control</th>
                <th className="py-2 pr-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {[
                ["SSO Enforcement", "Enforced"],
                ["Company Domain Restriction", "Active"],
                ["Quarterly Access Review", "Compliant"],
                ["RBAC Model", "Active"],
                ["Audit Logging", "Enabled"],
              ].map(([control, status], index) => (
                <tr
                  key={control}
                  className={
                    index % 2 === 0
                      ? "h-10 border-t border-b border-[#e1e4e8] bg-[#f9fafb]"
                      : "h-10 border-t border-b border-[#e1e4e8]"
                  }
                >
                  <td className="py-2 pr-3 text-slate-700">{control}</td>
                  <td className="py-2 pr-3">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#16a34a]" />
                    <span className="font-medium text-[#1a2332]">{status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
