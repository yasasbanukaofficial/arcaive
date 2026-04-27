"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/features/dashboard/components/Sidebar";
import TopBar from "@/features/dashboard/components/TopBar";
import OnboardingModal from "@/features/dashboard/components/OnboardingModal";
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

  const marginLeft = isMobile ? 0 : collapsed ? 72 : 240;
  const isNoPaddingPage = pathname === "/workflow" || pathname === "/interview";

  return (
    <div
      className="dashboard-theme min-h-screen font-sans transition-colors duration-300 scroll-smooth"
      data-theme={theme}
      style={{ backgroundColor: "var(--black)", color: "var(--white)" }}
    >
      {/* Subtle grid background */}
      <div className="fixed inset-0 grid-lines opacity-[0.03] pointer-events-none z-0" />

      <Sidebar />
      <OnboardingModal />

      <div
        className="relative z-10 min-h-screen flex flex-col"
        style={{
          marginLeft,
          transition: "margin-left 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "margin-left",
        }}
      >
        <TopBar />
        <main
          className={`flex-1 ${isNoPaddingPage ? "" : "p-5 sm:p-8 lg:p-10"}`}
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
