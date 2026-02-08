import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Message | Where thoughts become actions",
  description: "An AI companion that whispers clarity, conjures ideas, and guides your every move.",
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
        <SmoothScroll>
          <div className="bg-glows">
            <div className="glow-blue" />
            <div className="glow-purple" />
            <div className="glow-center" />
          </div>
          <div className="noise-overlay" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
