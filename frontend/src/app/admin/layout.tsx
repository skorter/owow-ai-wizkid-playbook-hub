"use client";

import AdminLayout from "@/components/admin/AdminLayout/AdminLayout";

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
