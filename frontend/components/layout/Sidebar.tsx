"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: "dashboard" },
  { name: "Articles", href: "/articles", icon: "description" },
  { name: "Search", href: "/search", icon: "search" },
  { name: "Analytics", href: "/analytics", icon: "monitoring" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-50 bg-[#0c0e14] backdrop-blur-xl bg-opacity-70 flex flex-col py-8 px-4 justify-between shadow-[20px_0_40px_rgba(226,226,235,0.04)]">
      <div className="space-y-10">
        <div className="px-2">
          <div className="text-xl font-black text-[#adc6ff] tracking-tighter uppercase font-headline">
            Market Intel
          </div>
          <div className="font-headline uppercase tracking-[0.05em] text-[0.6875rem] font-bold text-on-surface-variant mt-1">
            Dashboard
          </div>
        </div>
        <nav className="flex flex-col space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 py-3 px-3 rounded-lg transition-all duration-300",
                  isActive
                    ? "text-[#adc6ff] border-l-2 border-[#3b82f6] bg-gradient-to-r from-[#3b82f6]/10 to-transparent"
                    : "text-[#e2e2eb]/60 hover:text-[#e2e2eb] hover:bg-[#282a30]"
                )}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-headline uppercase tracking-[0.05em] text-[0.6875rem] font-bold">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col space-y-2 border-t border-outline-variant/10 pt-6">
        <Link
          href="#"
          className="flex items-center space-x-3 py-3 px-3 rounded-lg text-[#e2e2eb]/60 hover:text-[#e2e2eb] hover:bg-[#282a30] transition-all duration-300"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-headline uppercase tracking-[0.05em] text-[0.6875rem] font-bold">
            Settings
          </span>
        </Link>
        <Link
          href="#"
          className="flex items-center space-x-3 py-3 px-3 rounded-lg text-[#e2e2eb]/60 hover:text-[#e2e2eb] hover:bg-[#282a30] transition-all duration-300"
        >
          <span className="material-symbols-outlined">contact_support</span>
          <span className="font-headline uppercase tracking-[0.05em] text-[0.6875rem] font-bold">
            Support
          </span>
        </Link>
      </div>
    </aside>
  );
}
