import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpaceRadar — Live Orbital Tracking",
  description: "Interactive real-time satellite tracking dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
