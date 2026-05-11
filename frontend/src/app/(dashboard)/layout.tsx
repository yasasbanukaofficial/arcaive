"use client";

import React, { Suspense } from "react";
import TopBar from "@/features/dashboard/components/TopBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-brand)] selection:text-[var(--accent-brand-contrast)] antialiased transition-colors duration-300">
      {/* Dark Tech Noise Overlay - Scoped to Dashboard */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.015] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <TopBar />
      <main className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-[var(--text-primary)]/20 animate-pulse font-medium tracking-widest uppercase text-xs">Loading arcaive dashboard...</div>}>
          {children}
        </Suspense>
      </main>
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
      <DashboardShell>{children}</DashboardShell>
    </QueryClientProvider>
  );
}
