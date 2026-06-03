import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar"; // 👈 নতুন সাইadবার ইম্পোর্ট করলাম
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube",
  description: "Share your videos with friends, family, and the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-white">
        
        {/* ইউটিউব স্টাইল নেভবার */}
        <Navbar />

        {/* মেইন ভিডিও গ্রিড লেআউট এরিয়া */}
        <div className="flex w-full flex-1">
          
          {/* 🟢 ডাইনামিক আইকন-বেসড সাইডবার */}
          <Sidebar />

          {/* main content area */}
          <div className="min-w-0 flex-1 overflow-y-auto p-3 pb-20 sm:p-6 md:pb-6">
            <main>
              {children}
            </main>
          </div>
        </div>

        <Toaster position="bottom-right" />
        
      </body>
    </html>
  );
}
