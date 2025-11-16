import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ title, children }) {
    return (
        <div className="bg-slate-900/50 border border-white/10 p-5 rounded-xl shadow-lg backdrop-blur">
            {title && <h3 className="text-sm font-bold text-gray-400 mb-2">{title}</h3>}
            {children}
        </div>
    );
}
