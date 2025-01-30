import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

export const metadata: Metadata = {
  title: "TFT Set 13 Team Planner",
  description: "Plan your TFT teams!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className="font-sans antialiased bg-black h-full">
        <Providers>
          <div className="flex flex-col h-full">
            <Navbar />
            <div className="flex-1 w-full max-w-7xl px-8 mx-auto overflow-hidden">
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
