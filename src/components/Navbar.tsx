"use client";

import { useState } from "react";
import { Link, Button, Avatar } from "@heroui/react";
// react-icons/hi2 থেকে আইকনগুলো ইম্পোর্ট করা হয়েছে
import {
    HiBars3,
    HiMagnifyingGlass,
    HiMicrophone,
    HiVideoCamera,
    HiBell
} from "react-icons/hi2";

export function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0f0f0f] text-white px-4 h-14 flex items-center justify-between">

            {/* ১. বাম অংশ: মেনু এবং লোগো */}
            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white/10 rounded-full transition active:scale-95 text-xl">
                    <HiBars3 className="h-6 w-6" />
                </button>

                <Link href="/" className="flex items-center gap-1 text-white">
                    {/* ইউটিউব প্লে বাটন লোগো */}
                    <svg className="h-5 w-7 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 13.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span className="font-bold text-xl tracking-tighter font-sans hidden sm:block">YouTube</span>
                </Link>
            </div>

            {/* ২. মাঝের অংশ: সার্চ বার এবং মাইক */}
            <div className="flex flex-1 max-w-[640px] items-center gap-4 mx-4 justify-center">
                <form onSubmit={handleSearch} className="flex flex-1 items-center">
                    <div className="flex flex-1 bg-[#121212] border border-[#303030] rounded-l-full px-4 py-1.5 focus-within:border-blue-500 focus-within:bg-black transition items-center">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent outline-none text-sm placeholder:text-[#888888] text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#222222] border border-l-0 border-[#303030] rounded-r-full px-6 py-2 hover:bg-[#272727] transition flex items-center justify-center"
                        aria-label="Submit Search"
                    >
                        <HiMagnifyingGlass className="h-5 w-5 text-white" />
                    </button>
                </form>

                {/* ভয়েস সার্চ বাটন */}
                <button className="p-2.5 bg-[#222222] hover:bg-[#272727] rounded-full transition hidden md:block" aria-label="Voice Search">
                    <HiMicrophone className="h-5 w-5" />
                </button>
            </div>

            {/* ৩. ডান অংশ: ক্রিয়েট, নোটিফিকেশন এবং প্রোফাইল */}
            <div className="flex items-center gap-2 sm:gap-3">
                <button className="p-2 hover:bg-white/10 rounded-full transition hidden sm:block" aria-label="Create Video">
                    <HiVideoCamera className="h-6 w-6" />
                </button>

                <button className="p-2 hover:bg-white/10 rounded-full transition relative" aria-label="Notifications">
                    <HiBell className="h-6 w-6" />
                    {/* নোটিফিকেশন কাউন্টার */}
                    <span className="absolute top-1 right-1 bg-[#cc0000] text-[10px] text-white font-medium rounded-full h-4 w-4 flex items-center justify-center">
                        9+
                    </span>
                </button>

                {/* HeroUI Avatar */}
                <Avatar
                    size="sm"
                    className="cursor-pointer border border-transparent hover:border-white/20 transition ml-1"
                >
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="User Avatar"
                        className="h-full w-full object-cover"
                    />
                </Avatar>
            </div>

        </nav>
    );
}