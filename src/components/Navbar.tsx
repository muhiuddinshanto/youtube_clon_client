"use client";


import { useState, useRef, useEffect } from "react";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 

// React Icons
import {
    HiMagnifyingGlass,
    HiMicrophone,
    HiVideoCamera,
    HiBell,
    HiUserCircle,
    HiUser,
    HiArrowLeftOnRectangle
} from "react-icons/hi2";

export function Navbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Better-Auth থেকে ইউজারের সেশন ডাটা নিয়ে আসা
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchQuery.trim();
        router.push(query ? `/?search=${encodeURIComponent(query)}` : "/");
    };

    // লগআউট হ্যান্ডলার
    const handleSignOut = async () => {
        await authClient.signOut();
        setIsDropdownOpen(false);
        router.refresh();
    };

    // ড্রপডাউনের বাইরে ক্লিক করলে যেন মেনু বন্ধ হয়ে যায়
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-50 flex min-h-14 w-full flex-wrap items-center justify-between gap-2 border-b border-white/5 bg-[#0f0f0f] px-3 py-2 text-white sm:flex-nowrap sm:px-4 sm:py-0">

            {/* ১. বাম অংশ: লোগো */}
            <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/" className="flex items-center gap-1 text-white">
                    <svg className="h-5 w-7 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 13.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span className="font-bold text-xl tracking-tighter font-sans hidden sm:block">YouTube</span>
                </Link>
            </div>

            {/* ২. মাঝের অংশ: সার্চ বার এবং মাইক */}
            <div className="order-3 flex w-full flex-1 items-center justify-center gap-2 sm:order-none sm:mx-4 sm:max-w-[640px]">
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
                        className="bg-[#222222] border border-l-0 border-[#303030] rounded-r-full px-4 py-2 hover:bg-[#272727] transition flex items-center justify-center sm:px-6"
                        aria-label="Submit Search"
                    >
                        <HiMagnifyingGlass className="h-5 w-5 text-white" />
                    </button>
                </form>

                <button className="p-2.5 bg-[#222222] hover:bg-[#272727] rounded-full transition hidden md:block" aria-label="Voice Search">
                    <HiMicrophone className="h-5 w-5" />
                </button>
            </div>

            {/* ৩. ডান অংশ: সেশন কন্ডিশনাল রেন্ডারিং */}
            <div className="relative flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
                {isPending ? (
                    <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse"></div>
                ) : user ? (
                    <>
                        <button onClick={() => router.push(`/channel/${user.id}`)} className="p-2 hover:bg-white/10 rounded-full transition hidden sm:block" aria-label="Create Video">
                            <HiVideoCamera className="h-6 w-6" />
                        </button>

                        <button className="p-2 hover:bg-white/10 rounded-full transition relative" aria-label="Notifications">
                            <HiBell className="h-6 w-6" />
                            <span className="absolute top-1 right-1 bg-[#cc0000] text-[10px] text-white font-medium rounded-full h-4 w-4 flex items-center justify-center">
                                9+
                            </span>
                        </button>

                        {/* 🎯 প্রোফাইল ট্রিগার বাটন */}
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="cursor-pointer ml-1 select-none active:scale-95 transition focus:outline-none flex-shrink-0"
                        >
                            <div className="h-8 w-8 rounded-full border border-transparent hover:border-white/20 flex items-center justify-center bg-gray-600 text-white font-bold text-xs overflow-hidden">
                                {user.image ? (
                                    <img 
                                        src={user.image} 
                                        alt={user.name || "Avatar"} 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span>{user.name ? user.name[0].toUpperCase() : "U"}</span>
                                )}
                            </div>
                        </button>

                        {/* 🔮 কাস্টম রিয়েল ইউটিউব স্টাইল ড্রপডাউন মেনু */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-12 z-50 flex w-[min(300px,calc(100vw-24px))] flex-col rounded-xl border border-white/10 bg-[#212121] py-2 text-white shadow-2xl">
                                
                                {/* ১. ইউজার ডিটেইলস কার্ড */}
                                <div className="flex items-start gap-3 px-4 py-3 border-b border-white/10 mb-1">
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-600 text-white font-bold text-sm overflow-hidden flex-shrink-0">
                                        {user.image ? (
                                            <img 
                                                src={user.image} 
                                                alt={user.name || "Avatar"} 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span>{user.name ? user.name[0].toUpperCase() : "U"}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <p className="font-semibold text-sm text-white leading-tight truncate">{user.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                                        <button 
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                router.push(`/channel/${user.id || 'my-channel'}`);
                                            }}
                                            className="text-xs text-blue-400 mt-2 text-left hover:underline w-fit"
                                        >
                                            View your channel
                                        </button>
                                    </div>
                                </div>

                                {/* ২. অপশন: Your Channel */}
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        router.push(`/channel/${user.id}`);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 h-10 hover:bg-white/10 text-left transition text-white"
                                >
                                    <HiUser className="text-xl text-gray-400 flex-shrink-0" />
                                    <span className="text-sm font-medium">Your channel</span>
                                </button>

                                {/* ৩. অপশন: Sign Out */}
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 h-10 hover:bg-red-500/10 text-left transition mt-1"
                                >
                                    <HiArrowLeftOnRectangle className="text-xl text-red-400 flex-shrink-0" />
                                    <span className="text-sm font-medium text-red-400">Sign out</span>
                                </button>

                            </div>
                        )}
                    </>
                ) : (
                    <Link 
                        href="/login"
                        className="border border-white/20 hover:bg-white/10 text-blue-400 font-medium h-9 px-4 rounded-full text-sm flex items-center gap-1.5 bg-transparent transition active:scale-95 select-none"
                    >
                        <HiUserCircle className="text-xl" />
                        <span>Sign In</span>
                    </Link>
                )}
            </div>

        </nav>
    );
}
