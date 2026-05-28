"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
  Bell,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthenticationContext";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/shop", icon: LayoutDashboard },
    { name: "Products", href: "/shop/products", icon: Package },
    { name: "Add Product", href: "/shop/add", icon: PlusCircle },
    { name: "Reservations", href: "/shop/reservations", icon: ShieldCheck },
    { name: "Settings", href: "/shop/settings", icon: Settings },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  const displayName = user?.name ?? "Shop Owner";
  const displayEmail = user?.email ?? "";
  const initial = (user?.name?.[0] ?? "S").toUpperCase();

  const handleLogout = () => {
    logout();
    router.push("/auth?role=shop_owner&tab=login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#111111] text-white flex overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#161616] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2" onClick={closeSidebar}>
            <div className="bg-emerald-500 p-1.5 rounded-lg text-[#111111] shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Leaf size={20} className="fill-current" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Expiry<span className="text-emerald-500">Go</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
          <div className="mb-4 px-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Dashboard Menu
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all border ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "text-gray-400 hover:text-white border-transparent hover:bg-white/5"
                }`}
              >
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-emerald-400"
                      : "text-gray-500"
                  }
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-gray-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all text-left"
          >
            <LogOut size={20} className="text-gray-500" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#161616]/80 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 flex justify-end items-center gap-4">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white relative bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-8 w-8 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm border border-emerald-500/20 cursor-pointer transition shadow-[0_0_10px_rgba(16,185,129,0.15)]"
              >
                {initial}
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                      <p className="text-sm text-white font-bold truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/shop/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 w-full text-left transition-colors"
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
