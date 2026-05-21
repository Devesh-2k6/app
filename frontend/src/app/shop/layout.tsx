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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2" onClick={closeSidebar}>
            <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              FreshSave
            </span>
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            className="ml-auto lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
          <div className="mb-4 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                }`}
              >
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400 dark:text-gray-500"
                  }
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 w-full dark:text-gray-300 dark:hover:bg-gray-700/50 transition-all text-left"
          >
            <LogOut size={20} className="text-gray-400 dark:text-gray-500" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 flex justify-end items-center gap-4">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-200 dark:border-emerald-800 cursor-pointer hover:bg-emerald-200 transition"
              >
                {initial}
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/shop/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
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
