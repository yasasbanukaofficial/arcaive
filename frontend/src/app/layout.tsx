import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";
import { ToastProvider } from "@/components/ui/Toast";

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
    <html lang="en" className="dark">
      <body
        className={`${hostGrotesk.variable} antialiased selection:bg-white/20 relative`}
      >
        <ToastProvider>
          <SmoothScroll>
            <div className="bg-glows">
              <div className="glow-blue" />
              <div className="glow-purple" />
              <div className="glow-center" />
            </div>
            <div className="noise-overlay" />
            {children}
          </SmoothScroll>
        </ToastProvider>
      </body>
    </html>
  );
}
