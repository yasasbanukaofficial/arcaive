"use client";

import React from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/dashboard/SidebarContext";
import { ThemeProvider, useTheme } from "@/components/dashboard/ThemeContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed, isMobile } = useSidebar();
  const { theme } = useTheme();

  // On mobile: no left margin (sidebar is an overlay)
  // On desktop: margin follows sidebar width
  const marginLeft = isMobile ? 0 : collapsed ? 72 : 260;

  return (
    <div
      className="dashboard-theme min-h-screen font-sans transition-colors duration-300"
      data-theme={theme}
      style={{ backgroundColor: "var(--d-bg)", color: "var(--d-text-primary)" }}
    >
      {/* Background glows — scoped to dashboard */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500">
        <div
          className="absolute top-[-5%] right-[10%] w-[50vw] h-[50vh] blur-[120px]"
          style={{
            background: `radial-gradient(circle, var(--d-glow-blue) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[5%] w-[60vw] h-[60vh] blur-[140px]"
          style={{
            background: `radial-gradient(circle, var(--d-glow-purple) 0%, transparent 70%)`,
          }}
        />
      </div>

      <Sidebar />

      <motion.div
        animate={{ marginLeft }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
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
    <ThemeProvider>
      <SidebarProvider>
        <DashboardShell>{children}</DashboardShell>
      </SidebarProvider>
    </ThemeProvider>
  );
}
