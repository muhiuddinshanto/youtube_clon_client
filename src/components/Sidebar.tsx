"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiHome, 
  HiOutlineHome, 
  HiFolderMinus, 
  HiOutlineFolderMinus,
  HiRectangleStack,
  HiOutlineRectangleStack,
  HiArrowPath // 👈 HiHistory এর বদলে HiArrowPath ইম্পোর্ট করলাম
} from "react-icons/hi2";

export function Sidebar() {
  const pathname = usePathname();

  // মেনু আইটেমগুলোর একটি অ্যারে
  const mainNavItems = [
    { name: "Home", href: "/", icon: HiOutlineHome, activeIcon: HiHome },
    { name: "Subscriptions", href: "/subscriptions", icon: HiOutlineRectangleStack, activeIcon: HiRectangleStack },
  ];

  const libraryNavItems = [
    { name: "Library", href: "/library", icon: HiOutlineFolderMinus, activeIcon: HiFolderMinus },
    { name: "History", href: "/watch-history", icon: HiArrowPath, activeIcon: HiArrowPath }, // 👈 এখানে আইকন আপডেট করা হয়েছে
  ];

  // অ্যাক্টিভ ক্লাস বাটন স্টাইলিং ফাংশন
  const linkClass = (href: string) => {
    const isActive = pathname === href;
    return `w-full flex items-center gap-5 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
      isActive 
        ? "bg-white/10 text-white font-semibold" 
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    }`;
  };

  return (
    <>
    <aside className="w-64 flex-shrink-0 hidden md:block p-3 border-r border-[#272727] select-none bg-[#0f0f0f]">
      {/* প্রথম সেকশন: মেইন মেনু */}
      <div className="space-y-1">
        {mainNavItems.map((item) => {
          const IsActive = pathname === item.href;
          const Icon = IsActive ? item.activeIcon : item.icon;
          return (
            <Link key={item.name} href={item.href} className={linkClass(item.href)}>
              <Icon className="text-xl" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <hr className="border-[#272727] my-3 mx-2" />

      {/* দ্বিতীয় সেকশন: ইউজার লাইব্রেরি */}
      <div className="space-y-1">
        <h4 className="px-4 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">You</h4>
        {libraryNavItems.map((item) => {
          const IsActive = pathname === item.href;
          const Icon = IsActive ? item.activeIcon : item.icon;
          return (
            <Link key={item.name} href={item.href} className={linkClass(item.href)}>
              <Icon className="text-xl" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-[#272727] bg-[#0f0f0f] px-1 py-1 md:hidden">
      {[...mainNavItems, ...libraryNavItems].map((item) => {
        const isActive = pathname === item.href;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] ${isActive ? "text-white" : "text-gray-400"}`}
          >
            <Icon className="text-xl" />
            <span className="max-w-full truncate">{item.name}</span>
          </Link>
        );
      })}
    </nav>
    </>
  );
}
