"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../lib/api";
import AnimatedPage from "./../AnimatedPage";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const router = useRouter();

    async function onSubmit(e: any) {
        e.preventDefault();
        setLoading(true);
        setErr(null);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const { token } = await res.json();
            localStorage.setItem("token", token);
            router.push("/");
        } catch (e) {
            setErr("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatedPage>
            {/* Background */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">

                {/* Decorative glowing circles */}
                <div className="absolute top-10 left-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-52 h-52 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl w-full max-w-md"
                >
                    <h1 className="text-3xl font-bold text-center text-white mb-6">
                        Welcome Back 👋
                    </h1>
                    <p className="text-center text-slate-300 mb-8 text-sm">
                        Login to continue to your dashboard
                    </p>

                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* Email */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="text-slate-300 text-sm">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                placeholder="Enter email"
                            />
                        </motion.div>

                        {/* Password */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="text-slate-300 text-sm">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Enter password"
                            />
                        </motion.div>

                        {/* Error */}
                        {err && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {err}
                            </motion.div>
                        )}

                        {/* Button */}
                        <motion.button
                            whileHover={{ scale: loading ? 1 : 1.03 }}
                            whileTap={{ scale: loading ? 1 : 0.97 }}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900 font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Login"}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </AnimatedPage>
    );
}
