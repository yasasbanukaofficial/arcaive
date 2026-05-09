"use client";

import React, { Suspense } from "react";
import TopBar from "@/features/dashboard/components/TopBar";
import { ThemeProvider } from "@/features/dashboard/components/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QuotaExceededModal from "@/components/ui/QuotaExceededModal";

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e4e4e4] font-sans selection:bg-[#4a7c59] selection:text-white">
      {/* Dark Tech Noise Overlay - Scoped to Dashboard */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <TopBar />
      <main className="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-12">
        <Suspense fallback={<div className="text-white/50 animate-pulse">Loading dashboard...</div>}>
          {children}
        </Suspense>
      </main>
      <QuotaExceededModal />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: any) => {
              // Never retry on 429 (rate limit) or 401 (unauthorized)
              if (error?.response?.status === 429 || error?.response?.status === 401) {
                return false;
              }
              return failureCount < 1;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <DashboardShell>{children}</DashboardShell>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
