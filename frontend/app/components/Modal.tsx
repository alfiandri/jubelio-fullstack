"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="relative bg-slate-900 p-6 rounded-2xl w-full max-w-md border border-white/10 shadow-xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4 pr-6">{title}</h2>

                {children}

                <button
                    onClick={onClose}
                    className="
                    mt-6 w-full py-2 rounded-lg 
                    bg-red-600 hover:bg-red-700 
                    transition-colors font-medium
                    "
                >
                    Close
                </button>
            </motion.div>
        </div>
    );
}
