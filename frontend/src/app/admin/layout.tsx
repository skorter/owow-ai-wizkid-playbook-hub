"use client";

import AdminLayout from "@/components/admin/AdminLayout/AdminLayout";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminAuthGuard>
  );
}
