import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DAVTrading - Real-Time Trading Dashboard",
  description:
    "Professional trading dashboard with real-time crypto, stock, and forex data. Track markets, manage your portfolio, and stay informed with live news.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar />
        <div className="lg:pl-64">
          <Header />
          <main className="min-h-screen px-4 py-6 lg:px-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
