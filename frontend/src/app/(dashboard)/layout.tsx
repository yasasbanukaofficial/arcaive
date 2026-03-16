"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/features/dashboard/components/Sidebar";
import TopBar from "@/features/dashboard/components/TopBar";
import JobDetailsModal from "@/features/dashboard/components/JobDetailsModal";
import {
  SidebarProvider,
  useSidebar,
} from "@/features/dashboard/components/SidebarContext";
import { ThemeProvider, useTheme } from "@/features/dashboard/components/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed, isMobile } = useSidebar();
  const { theme } = useTheme();
  const pathname = usePathname();

  const marginLeft = isMobile ? 0 : collapsed ? 72 : 260;
  const isNoPaddingPage = pathname === "/workflow" || pathname === "/inteview";

  return (
    <div
      className="dashboard-theme h-screen font-sans transition-colors duration-300 scroll-smooth"
      data-theme={theme}
      style={{ backgroundColor: "var(--d-bg)", color: "var(--d-text-primary)" }}
    >
      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 will-change-auto">
        <div
          className="absolute top-[-5%] right-[10%] w-[50vw] h-[50vh] blur-[80px]"
          style={{
            background: `radial-gradient(circle, var(--d-glow-blue) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[5%] w-[60vw] h-[60vh] blur-[80px]"
          style={{
            background: `radial-gradient(circle, var(--d-glow-purple) 0%, transparent 70%)`,
          }}
        />
      </div>

      <Sidebar />
      <JobDetailsModal />

      <div
        className="relative z-10 flex h-screen flex-col"
        style={{
          marginLeft,
          transition: "margin-left 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "margin-left",
        }}
      >
        <TopBar />
        <main
          className={`min-h-0 flex-1 ${isNoPaddingPage ? "" : "p-5 sm:p-8 lg:p-10"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <DashboardShell>{children}</DashboardShell>
        </SidebarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
