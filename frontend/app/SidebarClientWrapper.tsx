"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });

export default function SidebarClientWrapper() {
    return (
        <motion.aside
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            <Sidebar />
        </motion.aside>
    );
}
