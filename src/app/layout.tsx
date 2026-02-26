import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "TFT Team Planner",
  description: "Plan your TFT teams and share them with the community!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-black">
        <Providers session={session}>
          <div className="flex flex-col min-h-screen">
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
