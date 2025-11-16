"use client";
import { motion } from "framer-motion";

export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 p-6 rounded-lg w-full max-w-md border border-white/10"
            >
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                {children}

                <button
                    onClick={onClose}
                    className="mt-4 text-gray-400 hover:text-gray-300"
                >
                    Close
                </button>
            </motion.div>
        </div>
    );
}
