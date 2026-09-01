'use client';

import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {children}
      </div>
    </div>
  );
}
