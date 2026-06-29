import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Reprompting Profile™",
  description: "Discover the system prompt quietly shaping your life."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
