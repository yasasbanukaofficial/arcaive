import type { Metadata } from "next";
import { Host_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";
import { ToastProvider } from "@/components/ui/Toast";
import QuotaExceededModal from "@/components/ui/QuotaExceededModal";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const hostGrotesk = Host_Grotesk({
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
    <html lang="en" className={cn("dark", "font-sans", inter.variable)}>
      <body
        className={`${hostGrotesk.variable} antialiased selection:bg-white/20 relative`}
      >
        <ToastProvider>
          <QuotaExceededModal />
          <SmoothScroll>
            <div className="noise-overlay" />
            {children}
          </SmoothScroll>
        </ToastProvider>
      </body>
    </html>
  );
}
