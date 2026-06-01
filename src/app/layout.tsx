import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

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

        {/* মেইন ভিডিও গ্রিড লেআউট এরিয়া */}
        <div className="flex w-full flex-1">
          {/* sidebar */}
         <aside className="w-64 flex-shrink-0 hidden md:block p-4 border-r border-[#272727]">
            {/* এখানে আপনার সাইডবারের মেনু আইটেমগুলো বসবে */}
            <div className="space-y-4 text-sm text-gray-400">
              <div className="text-white font-medium">Home</div>
              <div>Shorts</div>
              <div>Subscriptions</div>
              <hr className="border-[#272727]" />
              <div>Library</div>
              <div>History</div>
            </div>
          </aside>
         {/* main */}
         <div className="flex-1 p-6 overflow-y-auto ">
           <main >
          {children}
        </main>
         </div>
        </div>
        
      </body>
    </html>
  );
}