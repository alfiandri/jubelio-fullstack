"use client";

import {
    Home,
    Package,
    ShoppingCart,
    BarChart3,
    Upload,
    Menu,
    LogOut,
    LogIn
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const update = () => setLoggedIn(!!localStorage.getItem("token"));
        update();
        window.addEventListener("storage", update);
        return () => window.removeEventListener("storage", update);
    }, []);

    const logout = () => {
        if (confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("storage"));
            window.location.href = "/login";
        }
    };

    return (
        <aside
            className={clsx(
                "bg-slate-900 text-gray-200 h-screen flex flex-col transition-all duration-300 border-r border-white/10",
                collapsed ? "w-20" : "w-60"
            )}
        >
            {/* Top Section */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                {!collapsed && (
                    <span className="text-xl font-bold tracking-wide">Jubelio</span>
                )}
                <button onClick={() => setCollapsed(!collapsed)}>
                    <Menu size={22} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-2">
                {[
                    { href: "/", label: "Home", icon: <Home size={20} /> },
                    { href: "/items", label: "Items", icon: <Package size={20} /> },
                    { href: "/transactions", label: "Transactions", icon: <ShoppingCart size={20} /> },
                    { href: "/summary", label: "Summary", icon: <BarChart3 size={20} /> },
                    { href: "/import", label: "Import", icon: <Upload size={20} /> }
                ].map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition",
                            collapsed && "justify-center"
                        )}
                    >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Auth */}
            <div className="p-4 border-t border-white/10">
                {loggedIn ? (
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300"
                    >
                        <LogOut size={18} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                    >
                        <LogIn size={18} />
                        {!collapsed && <span>Login</span>}
                    </Link>
                )}
            </div>
        </aside>
    );
}
