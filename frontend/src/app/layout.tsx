import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/animations/SmoothScroll";
import { ToastProvider } from "@/components/ui/Toast";
import QuotaExceededModal from "@/components/ui/QuotaExceededModal";
import { ThemeProvider } from "@/features/dashboard/components/ThemeContext";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARCAIVE | Where your career is automated",
  description:
    "An engine that does the hard work for you while you relax. A digital intelligence that uncovers hidden roles, aligns your achievements, and secures your entry into the world’s leading companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${spaceGrotesk.variable} antialiased bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300 relative flex min-h-screen flex-col overflow-x-hidden`}
      >
        <ThemeProvider>
          <ToastProvider>
             <QuotaExceededModal />
             <SmoothScroll>
              {/* Dark Tech Noise Overlay */}
              <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              {children}
              
            </SmoothScroll>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
