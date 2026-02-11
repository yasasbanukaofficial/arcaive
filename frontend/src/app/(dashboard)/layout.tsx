"use client";

import React from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/dashboard/SidebarContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Background glows — scoped to dashboard */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[10%] w-[50vw] h-[50vh] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_70%)] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[5%] w-[60vw] h-[60vh] bg-[radial-gradient(circle,rgba(139,92,246,0.04)_0%,transparent_70%)] blur-[140px]" />
      </div>

      {/* Noise overlay */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-[9999] bg-[url('/images/noise.png')] bg-repeat" />

      <Sidebar />

      <motion.div
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        <TopBar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </motion.div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}
