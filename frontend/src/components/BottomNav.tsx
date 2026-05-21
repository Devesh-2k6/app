"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tag, MapPin, Bell, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/deals", label: "Deals", icon: Tag },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 safe-area-pb">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-3 px-5 rounded-2xl transition-all duration-200 ${
                active
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={`transition-transform duration-200 ${active ? "scale-110" : ""}`}
                />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${active ? "opacity-100" : "opacity-70"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
