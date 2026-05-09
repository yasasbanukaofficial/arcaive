"use client";

import React, { Suspense } from "react";
import TopBar from "@/features/dashboard/components/TopBar";
import { ThemeProvider } from "@/features/dashboard/components/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QuotaExceededModal from "@/components/ui/QuotaExceededModal";

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070707] text-[#e4e4e4] font-sans selection:bg-[#dfe7d8] selection:text-black antialiased">
      {/* Dark Tech Noise Overlay - Scoped to Dashboard */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.015] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <TopBar />
      <main className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-white/20 animate-pulse font-medium tracking-widest uppercase text-xs">Loading arcaive dashboard...</div>}>
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
